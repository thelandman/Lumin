var Editor = (function () {
    function Editor(btnStart, text, classList, maxLength, callback) {
        var _this = this;
        this.windowClickFunc = function (e) { };
        btnStart.onclick = function () { return _this.start(); };
        this.maxLength = maxLength;
        this.callback = callback;
        this.rootElm = ViewUtil.tag('div', { classList: "editor " + classList });
        this.errorBox = new ContentBox(ViewUtil.tag('div', { classList: 'error-box' }));
        this.textBox = ViewUtil.tag('div', { classList: 'editable-text', innerText: text });
        this.currentText = this.textBox.innerText;
        this.btnSlot = ViewUtil.tag('div', { classList: 'editor-btn-slot' });
        this.btnConfirm = Icons.confirm();
        this.btnCancel = Icons.cancel();
        this.btnSlot.append(this.btnConfirm, this.btnCancel);
        this.fillRootElm();
        this.btnConfirm.onclick = function (e) { return _this.send(); };
        this.btnCancel.onclick = function (e) { return _this.revert(); };
        this.targetHandles = [
            this.rootElm, this.errorBox.rootElm,
            this.btnSlot, this.btnConfirm,
            this.btnCancel, this.textBox,
            btnStart
        ];
        var childNodes = btnStart.childNodes;
        childNodes.forEach(function (c) { return _this.targetHandles.push(c); });
        window.addEventListener('click', function (e) { return _this.windowClickFunc(e); });
    }
    Editor.prototype.fillRootElm = function (textBox2) {
        if (textBox2 === void 0) { textBox2 = null; }
        if (textBox2 == null)
            this.rootElm.append(this.errorBox.rootElm, this.textBox, this.btnSlot);
        else
            this.rootElm.append(this.errorBox.rootElm, this.textBox, textBox2, this.btnSlot);
    };
    Editor.prototype.turnOnWindowClickFunc = function () {
        var _this = this;
        this.windowClickFunc = function (event) {
            var hit = false;
            _this.targetHandles.forEach(function (targetHandle) {
                if (event.target == targetHandle)
                    hit = true;
            });
            if (!hit)
                _this.revert();
        };
    };
    Editor.prototype.setText = function (text) {
        this.textBox.innerText = text;
    };
    Editor.prototype.start = function () {
        this.currentText = this.textBox.innerText;
        ViewUtil.show(this.btnSlot);
        this.textBox.contentEditable = "" + true;
        this.textBox.focus();
        this.turnOnWindowClickFunc();
    };
    Editor.prototype.send = function () {
        if (this.textBox.innerText.length <= this.maxLength) {
            if (this.callback != null)
                this.callback(this.textBox.innerText);
            this.end();
        }
        else
            this.errorBox.add({
                rootElm: ViewUtil.tag('div', {
                    classList: 'errorMsg',
                    innerText: "- Must be less than " + this.maxLength + " characters"
                })
            });
    };
    Editor.prototype.end = function () {
        ViewUtil.hide(this.btnSlot);
        this.errorBox.clear();
        this.textBox.contentEditable = "" + false;
        this.windowClickFunc = function (e) { };
    };
    Editor.prototype.revert = function () {
        this.textBox.innerText = this.currentText;
        this.end();
    };
    return Editor;
}());
//# sourceMappingURL=Editor.js.map