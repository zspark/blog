const common = require("../core/common");
const constant = common.constant;
var base = require(common.pathes.pathLayout + "layout_base")

class LayoutHistory extends base {
    constructor() {
        super();
    }

    Generate(arrList) {
        let content = `<h1>⏳History</h1><h1>These articles were modified/created/deleted recently.</h1>
<ol class="history">`;

        arrList.forEach(function (item) {
            content += `<li>
    <span><a href="/view?n=${item.fileName}">${item.title}</a></span>
    <span class="date">${item.action}</span>
    <span class="date">${item.time}</span>
</li>`;
        });

        content += `</ol >`;
        return this.GenerateHtml(null, this.GenerateHtmlBody(null, this.GenerateBodyMiddle("", content, null, "container top-offset-70"), null, null));
    }
};

module.exports = LayoutHistory;