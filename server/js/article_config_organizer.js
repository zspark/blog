const common = require("./common");
const pathes = common.pathes;
const LOG = require(pathes.pathJS + 'debug_logger');
const Utils = require(pathes.pathJS + "utils");
const FileFolderHandler = require(pathes.pathJS + 'file_folder_handler');

const M_CATEGORY = common.constant.M_CATEGORY;
const M_ARTICLE = common.constant.M_ARTICLE;

class Organizer {
  constructor() {
    LOG.Info("[CONSTRUCT] article organizer...");
    this.configCategories = Object.create(null);
    let configJson = FileFolderHandler.ReadFileUTF8(pathes.urlArticleConfig);
    LOG.Info("parse article config...");
    this.config = JSON.parse(configJson);
    this.configArticles = this.config[M_ARTICLE];

    for (let fileName in this.configArticles) {
      let category = this.configArticles[fileName][M_CATEGORY];
      this._AppendToCategory(category, fileName);
    }
  };

  _RemoveFromCategory(category, fileName) {
    let _arr = this.configCategories[category];
    if (_arr) {
      Utils.DeleteFromArray(_arr, fileName);
      if (_arr.length <= 0) delete this.configCategories[category];
    }
  };

  _AppendToCategory(category, fileName) {
    let _arr = this.configCategories[category];
    if (!_arr) {
      _arr = [];
      this.configCategories[category] = _arr;
    }
    _arr.push(fileName);
  }

  _DeleteArticleFromDisk(fileName) {
    let b = FileFolderHandler.DeleteFile(pathes.pathArticle + fileName);
    if (b) {
      LOG.Info("article deleted, file name:%s", fileName);
    } else {
      LOG.Error("article deleting failed! file name:%s", fileName);
    }
  }

  _SaveArticleToDisk(fileName, content, cb) {
    var b = FileFolderHandler.WriteFileUTF8(pathes.pathArticle + fileName, content, ".md");
    if (b) {
      LOG.Info("article saved successfully. file name:%s", fileName);
    } else {
      LOG.Error("article saving failure! file name:%s", fileName);
    }
    if (cb) cb(b);
  }

  _ModifyConfig(cfg, fileName, category, title, options) {
    if (fileName) cfg["fileName"] = fileName;
    if (category) cfg[M_CATEGORY] = category;
    if (title) cfg["displayName"] = title;
    if (options) {
      if (options.author) cfg["author"] = options.author;
      if (options.published) cfg["published"] = options.published;
      if (options.template) cfg["template"] = options.template;
    }
  }

  SaveConfigToDisk() {
    let configStr = JSON.stringify(this.config);
    var b = FileFolderHandler.WriteFileUTF8(pathes.urlArticleConfig, configStr);
    if (b) {
      LOG.Info("save article config content to disk successfully.");
    } else {
      LOG.Error("save article config content to disk failed!");
    }
  };

  Add(fileName, category, title, content, save = true) {
    if (this.GetConfig(fileName)) return false;

    let _cfg = Object.create(null);
    _cfg["createTime"] = new Date().toISOString();
    this._ModifyConfig(_cfg, fileName, category, title,
      { author: "Jerry Chaos", published: true, template: "template_view.ejs" }
    );
    this.configArticles[fileName] = _cfg;
    this._AppendToCategory(category, fileName);

    if (save) {
      this.SaveConfigToDisk();
      this._SaveArticleToDisk(fileName, content);
    }
    return true;
  };

  Delete(fileName) {
    let config = this.GetConfig(fileName);
    if (config) {
      const _category = config[M_CATEGORY];
      this._RemoveFromCategory(_category, fileName);
      delete this.configArticles[fileName];
      this.SaveConfigToDisk();
      this._DeleteArticleFromDisk(fileName);
      LOG.Info("article deleted. file name:%s", fileName);
      return true;
    } else {
      LOG.Error("there is no config exist! file name:%s", fileName);
      return false;
    }
  };

  Modify(fileName, category, title, content, options = null) {
    let _cfg = this.GetConfig(fileName);
    if (_cfg) {
      let lastCategory = _cfg[M_CATEGORY];
      if (lastCategory != category) {
        this._RemoveFromCategory(lastCategory, fileName);
        this._AppendToCategory(category, fileName);
      }
      this._ModifyConfig(_cfg, fileName, category, title, { author: "Jerry Chaos", published: true, template: "template_view.ejs" });
      this.SaveConfigToDisk();
      this._SaveArticleToDisk(fileName, content);
      LOG.Info("article modified. file name:%s", fileName);
      return true;
    } else {
      LOG.Error("there is no config exist! file name:%s", fileName);
      return false;
    }
  }

  /**
   * @param {String} fileName
   * @param {Object}
   */
  GetConfig(fileName) {
    return this.configArticles[fileName];
  }

  /**
   * @param {String} category 
   * @return {Array}
   */
  GetCategory(category) {
    return this.configCategories[category];
  }

  GetCategories(){
    let _c=JSON.parse(JSON.stringify(this.configCategories));
    return _c;
  }

  GetArticleCount(){
    let _n = 0;
    for (let fileName in this.configArticles) {
      ++_n;
    }
    return _n;
  }
};

let org = new Organizer();
module.exports = org;
