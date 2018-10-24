(function (e) {
    "use strict";

    function o() {}

    function n(e, o, n) {
        var t, i, l, a = null,
            d = 0;
        n || (n = {});
        var s = function () {
            d = n.leading === !1 ? 0 : (new Date).getTime(), a = null, l = e.apply(t, i), a || (t = i = null)
        };
        return function () {
            var c = (new Date).getTime();
            d || n.leading !== !1 || (d = c);
            var r = o - (c - d);
            return t = this, i = arguments, r <= 0 || r > o ? (clearTimeout(a), a = null, d = c, l = e.apply(t, i), a || (t = i = null)) : a || n.trailing === !1 || (a = setTimeout(s, r)), l
        }
    }

    function t() {
        var e = this.isLabelMode,
            o = this.config.searchable,
            n = o ? '<span class="dropdown-search">' + this.config.input + "</span>" : "";
        return e ? '<div class="dropdown-display-label"><div class="dropdown-chose-list">' + n + '</div></div><div class="dropdown-main">{{ul}}</div>' : '<a href="javascript:;" class="dropdown-display" tabindex="0"><span class="dropdown-chose-list"></span><a href="javascript:;"  class="dropdown-clear-all" tabindex="0">×</a></a><div class="dropdown-main">' + n + "{{ul}}</div>"
    }

    function i() {
        var o = this,
            n = o.config,
            t = o.$el,
            i = t.find(".dropdown-maxItem-alert");
        clearTimeout(o.maxItemAlertTimer), 0 === i.length && (i = e('<div class="dropdown-maxItem-alert">最多可选择' + n.limitCount + "个</div>")), t.append(i), o.maxItemAlertTimer = setTimeout(function () {
            t.find(".dropdown-maxItem-alert").remove()
        }, 1e3)
    }

    function l(o) {
        var n = o || "";
        return n = n.replace(/<select[^>]*>/gi, "").replace("</select>", ""), n = n.replace(/<\/optgroup>/gi, ""), n = n.replace(/<optgroup[^>]*>/gi, function (e) {
            var o = /label="(.[^"]*)"(\s|>)/.exec(e),
                n = /data\-group\-id="(.[^"]*)"(\s|>)/.exec(e);
            return '<li class="dropdown-group" data-group-id="' + (n ? n[1] : "") + '">' + (o ? o[1] : "") + "</li>"
        }), n = n.replace(/<option(.*?)<\/option>/gi, function (o) {
            var n = e(o).val(),
                t = />(.*)<\//.exec(o),
                i = o.indexOf("selected") > -1,
                l = o.indexOf("disabled") > -1,
                a = "";
            o.replace(/data-(\w+)="?(.[^"]+)"?/g, function (e) {
                a += e + " "
            });
            return "<li " + (l ? " disabled" : ' tabindex="0"') + ' data-value="' + (n || "") + '" class="dropdown-option ' + (i ? "dropdown-chose" : "") + '" ' + a + ">" + (t ? t[1] : "") + "</li>"
        })
    }

    function a(o) {
        var n = this,
            t = {},
            i = "",
            l = [],
            a = 0,
            d = n.config.extendProps;
        return !(!o || !o.length) && (e.each(o, function (o, n) {
            var i = n.groupId,
                s = n.disabled ? " disabled" : "",
                c = n.selected && !s ? " selected" : "",
                r = "";
            e.each(d, function (e, o) {
                n[o] && (r += "data-" + o + '="' + n[o] + '" ')
            });
            var p = "<option" + s + c + ' value="' + n.id + '" ' + r + ">" + n.name + "</option>";
            c && (l.push('<span class="dropdown-selected">' + n.name + '<i class="del" data-id="' + n.id + '"></i></span>'), a++), i ? t[n.groupId] ? t[n.groupId] += p : t[n.groupId] = n.groupName + "&janking&" + p : t[o] = p
        }), e.each(t, function (e, o) {
            var n = o.split("&janking&");
            if (2 === n.length) {
                var t = n[0],
                    l = n[1];
                i += '<optgroup label="' + t + '" data-group-id="' + e + '">' + l + "</optgroup>"
            } else i += o
        }), [i, l, a])
    }

    function d(o) {
        function n(o, n) {
            var t = e(n);
            this.id = t.prop("value"), this.name = t.text(), this.disabled = t.prop("disabled"), this.selected = t.prop("selected")
        }
        var t = o,
            i = [];
        return e.each(t.children(), function (o, t) {
            var l = {},
                a = {},
                d = e(t);
            "OPTGROUP" === t.nodeName ? (a.groupId = d.data("groupId"), a.groupName = d.attr("label"), e.each(d.children(), e.proxy(n, l)), e.extend(l, a)) : e.each(d, e.proxy(n, l)), i.push(l)
        }), i
    }

    function s(o, n) {
        this.$el = e(n), this.$select = this.$el.find("select"), this.placeholder = this.$select.attr("placeholder"), this.config = o, this.name = [], this.isSingleSelect = !this.$select.prop("multiple"), this.selectAmount = 0, this.maxItemAlertTimer = null, this.isLabelMode = "label" === this.config.multipleMode, this.init()
    }
    var c = function () {
            var e = navigator.userAgent.toLowerCase();
            if (e.indexOf("safari") !== -1) return !(e.indexOf("chrome") > -1)
        }(),
        r = {
            readonly: !1,
            limitCount: 1 / 0,
            input: '<input type="text" maxLength="20" placeholder="搜索关键词或ID">',
            data: [],
            searchable: !0,
            searchNoData: '<li class="searchNoData">查无数据</li>',
            init: o,
            choice: o,
            extendProps: []
        },
        p = {
            up: 38,
            down: 40,
            enter: 13
        },
        u = {
            click: "click.iui-dropdown",
            focus: "focus.iui-dropdown",
            keydown: "keydown.iui-dropdown",
            keyup: "keyup.iui-dropdown"
        },
        h = {
            show: function (o) {
                o.stopPropagation();
                var n = this;
                e(document).trigger("click.dropdown"), n.$el.addClass("active")
            },
            search: n(function (o) {
                var n = this,
                    t = n.config,
                    i = n.$el,
                    d = e(o.target),
                    s = d.val(),
                    c = n.config.data,
                    r = [];
                o.keyCode > 36 && o.keyCode < 41 || (e.each(c, function (e, o) {
                    (o.groupName && o.groupName.toLowerCase().indexOf(s.toLowerCase()) > -1 || o.name.toLowerCase().indexOf(s.toLowerCase()) > -1 || "" + o.id == "" + s) && r.push(o)
                }), i.find("ul").html(l(a.call(n, r)[0]) || t.searchNoData))
            }, 300),
            control: function (o) {
                var n, t, i, l = o.keyCode,
                    a = p,
                    d = 0;
                l !== a.down && l !== a.up || (n = l === a.up ? -1 : 1, i = this.$el.find("[tabindex]"), t = i.index(e(document.activeElement)), d = t === -1 ? n + 1 ? -1 : 0 : t, d += n, d === i.length && (d = 0), i.eq(d).focus(), o.preventDefault())
            },
            multiChoose: function (o, n) {
                var t, l = this,
                    a = l.config,
                    d = l.$select,
                    s = e(o.target),
                    c = s.attr("data-value"),
                    r = s.hasClass("dropdown-chose"),
                    p = [];
                if (s.hasClass("dropdown-display")) return !1;
                if (r) s.removeClass("dropdown-chose"), l.selectAmount--;
                else {
                    if (!(l.selectAmount < a.limitCount)) return i.call(l), !1;
                    s.addClass("dropdown-chose"), l.selectAmount++
                }
                l.name = [], e.each(a.data, function (e, o) {
                    "" + o.id == "" + c && (t = o, o.selected = !r), o.selected && (p.push(o.name), l.name.push('<span class="dropdown-selected">' + o.name + '<i class="del" data-id="' + o.id + '"></i></span>'))
                }), d.find('option[value="' + c + '"]').prop("selected", !r), l.$choseList.find(".dropdown-selected").remove(), l.$choseList.prepend(l.name.join("")), l.$el.find(".dropdown-display").attr("title", p.join(",")), a.choice.call(l, o, t)
            },
            singleChoose: function (o) {
                var n = this,
                    t = n.config,
                    i = n.$el,
                    l = n.$select,
                    a = e(o.target),
                    d = a.attr("data-value"),
                    s = a.hasClass("dropdown-chose");
                return !a.hasClass("dropdown-chose") && !a.hasClass("dropdown-display") && (n.name = [], i.removeClass("active").find("li").not(a).removeClass("dropdown-chose"), a.toggleClass("dropdown-chose"), e.each(t.data, function (e, o) {
                    o.selected = !1, "" + o.id == "" + d && (o.selected = s ? 0 : 1, o.selected && n.name.push('<span class="dropdown-selected">' + o.name + '<i class="del" data-id="' + o.id + '"></i></span>'))
                }), l.find('option[value="' + d + '"]').prop("selected", !0), n.name.push('<span class="placeholder">' + n.placeholder + "</span>"), n.$choseList.html(n.name.join("")), void t.choice.call(n, o))
            },
            del: function (o) {
                var n = this,
                    t = e(o.target),
                    i = t.data("id");
                return e.each(n.name, function (e, o) {
                    if (o.indexOf('data-id="' + i + '"') !== -1) return n.name.splice(e, 1), !1
                }), e.each(n.config.data, function (e, o) {
                    if ("" + o.id == "" + i) return o.selected = !1, !1
                }), n.selectAmount--, n.$el.find('[data-value="' + i + '"]').removeClass("dropdown-chose"), n.$el.find('[value="' + i + '"]').prop("selected", !1).removeAttr("selected"), t.closest(".dropdown-selected").remove(), !1
            },
            clearAll: function (o) {
                return o && o.preventDefault(), console.log(this), this.$choseList.find(".del").each(function (o, n) {
                    e(n).trigger("click")
                }), this.$el.find(".dropdown-display").removeAttr("title"), !1
            }
        };
    s.prototype = {
        init: function () {
            var e = this,
                o = e.config,
                n = e.$el;
            e.$select.hide(), n.addClass(e.isSingleSelect ? "dropdown-single" : e.isLabelMode ? "dropdown-multiple-label" : "dropdown-multiple"), 0 === o.data.length && (o.data = d(e.$select));
            var t = a.call(e, o.data);
            e.name = t[1], e.selectAmount = t[2], e.$select.html(t[0]), e.renderSelect(), e.changeStatus(o.disabled ? "disabled" : !!o.readonly && "readonly"), e.config.init()
        },
        renderSelect: function (o, n) {
            var i, a = this,
                d = a.$el,
                s = a.$select,
                c = l(s.prop("outerHTML"));
            o ? d.find("ul")[n ? "html" : "append"](c) : (i = t.call(a).replace("{{ul}}", "<ul>" + c + "</ul>"), d.append(i).find("ul").removeAttr("style class")), n && (a.name = [], a.$el.find(".dropdown-selected").remove(), a.$select.val("")), a.$choseList = d.find(".dropdown-chose-list"), a.isLabelMode || a.$choseList.html(e('<span class="placeholder"></span>').text(a.placeholder)), a.$choseList.prepend(a.name ? a.name.join("") : [])
        },
        bindEvent: function () {
            var o = this,
                n = o.$el,
                t = c ? u.click : u.focus;
            n.on(u.click, function (e) {
                e.stopPropagation()
            }), n.on(u.click, ".del", e.proxy(h.del, o)), o.isLabelMode ? (n.on(u.click, ".dropdown-display-label", function () {
                n.find("input").focus()
            }), o.config.searchable ? n.on(u.focus, "input", e.proxy(h.show, o)) : n.on(u.click, e.proxy(h.show, o)), n.on(u.keydown, "input", function (e) {
                8 === e.keyCode && "" === this.value && o.name.length && n.find(".del").eq(-1).trigger("click")
            })) : (n.on(t, ".dropdown-display", e.proxy(h.show, o)), n.on(t, ".dropdown-clear-all", e.proxy(h.clearAll, o))), n.on(u.keyup, "input", e.proxy(h.search, o)), n.on(u.keyup, function (n) {
                var t = n.keyCode,
                    i = p;
                t === i.enter && e.proxy(o.isSingleSelect ? h.singleChoose : h.multiChoose, o, n)()
            }), n.on(u.keydown, e.proxy(h.control, o)), n.on(u.click, "li[tabindex]", e.proxy(o.isSingleSelect ? h.singleChoose : h.multiChoose, o))
        },
        unbindEvent: function () {
            var e = this,
                o = e.$el,
                n = c ? u.click : u.focus;
            o.off(u.click), o.off(u.click, ".del"), e.isLabelMode ? (o.off(u.click, ".dropdown-display-label"), o.off(u.focus, "input"), o.off(u.keydown, "input")) : (o.off(n, ".dropdown-display"), o.off(n, ".dropdown-clear-all")), o.off(u.keyup, "input"), o.off(u.keyup), o.off(u.keydown), o.off(u.click, "[tabindex]")
        },
        changeStatus: function (e) {
            var o = this;
            "readonly" === e ? o.unbindEvent() : "disabled" === e ? (o.$select.prop("disabled", !0), o.unbindEvent()) : (o.$select.prop("disabled", !1), o.bindEvent())
        },
        update: function (e, o) {
            var n = this,
                t = n.config,
                i = (n.$el, o || !1);
            if ("[object Array]" === Object.prototype.toString.call(e)) {
                t.data = i ? e.slice(0) : t.data.concat(e);
                var l = a.call(n, t.data);
                n.name = l[1], n.selectAmount = l[2], n.$select.html(l[0]), n.renderSelect(!0, i)
            }
        },
        destroy: function () {
            this.unbindEvent(), this.$el.children().not("select").remove(), this.$el.removeClass("dropdown-single dropdown-multiple-label dropdown-multiple"), this.$select.show()
        },
        choose: function (o, n) {
            var t = "[object Array]" === Object.prototype.toString.call(o) ? o : [o],
                i = this,
                l = void 0 === n || !!n;
            e.each(t, function (e, o) {
                var t = i.$el.find('[data-value="' + o + '"]'),
                    a = t.hasClass("dropdown-chose");
                a !== l && t.trigger(u.click, n || !0)
            })
        },
        reset: function () {
            h.clearAll.call(this)
        }
    }, e(document).on("click.dropdown", function () {
        e(".dropdown-single,.dropdown-multiple,.dropdown-multiple-label").removeClass("active")
    }), e.fn.dropdown = function (o) {
        return this.each(function (n, t) {
            e(t).data("dropdown", new s(e.extend(!0, {}, r, o), t))
        }), this
    }
})(jQuery);
