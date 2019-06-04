seajs.config({
    paths : {
        'mark_base' : '/mark/static/js_ng',
        'bf_base': '/mark/static/js_ng/lib/BFBase',
        'bui_table': '/mark/static/js_ng/lib/BUIComponent/BUITable',
        'bui_search_select': '/mark/static/js_ng/lib/BUIComponent/BUISearchSelect'
    },
    alias: {},
    map: [[/^(.*\.(?:css|js))(.*)$/i, '$1?v=2019053116']]
});
