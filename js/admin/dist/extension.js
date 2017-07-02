'use strict';

System.register('radixi0/sharing/addSharingConfigPane', ['flarum/app', 'flarum/extend', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'radixi0/sharing/components/SharingConfigPage'], function (_export, _context) {
    "use strict";

    var app, extend, AdminNav, AdminLinkButton, SharingConfigPage;

    _export('default', function () {
        app.routes.sharing = { path: '/sharing', component: SharingConfigPage.component() };

        app.extensionSettings['radixio-sharing-list'] = function () {
            return m.route(app.route('sharing'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            items.add('sharing', AdminLinkButton.component({
                href: app.route('sharing'),
                icon: 'share-alt-square',
                children: app.translator.trans('radixio-sharing.admin.nav.sharing_button'),
                description: app.translator.trans('radixio-sharing.admin.nav.sharing_text')
            }));
        });
    });

    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsAdminNav) {
            AdminNav = _flarumComponentsAdminNav.default;
        }, function (_flarumComponentsAdminLinkButton) {
            AdminLinkButton = _flarumComponentsAdminLinkButton.default;
        }, function (_radixi0SharingComponentsSharingConfigPage) {
            SharingConfigPage = _radixi0SharingComponentsSharingConfigPage.default;
        }],
        execute: function () {}
    };
});;
"use strict";

System.register("radixi0/sharing/components/SharingConfigPage", ["flarum/Component", "flarum/components/Button", "flarum/utils/saveSettings", "flarum/components/Alert", "flarum/components/Switch"], function (_export, _context) {
    "use strict";

    var Component, Button, saveSettings, Alert, Switch, SharingConfigPage;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumUtilsSaveSettings) {
            saveSettings = _flarumUtilsSaveSettings.default;
        }, function (_flarumComponentsAlert) {
            Alert = _flarumComponentsAlert.default;
        }, function (_flarumComponentsSwitch) {
            Switch = _flarumComponentsSwitch.default;
        }],
        execute: function () {
            SharingConfigPage = function (_Component) {
                babelHelpers.inherits(SharingConfigPage, _Component);

                function SharingConfigPage() {
                    babelHelpers.classCallCheck(this, SharingConfigPage);
                    return babelHelpers.possibleConstructorReturn(this, (SharingConfigPage.__proto__ || Object.getPrototypeOf(SharingConfigPage)).apply(this, arguments));
                }

                babelHelpers.createClass(SharingConfigPage, [{
                    key: "init",
                    value: function init() {
                        var _this2 = this;

                        babelHelpers.get(SharingConfigPage.prototype.__proto__ || Object.getPrototypeOf(SharingConfigPage.prototype), "init", this).call(this);

                        this.loading = false;

                        // the fields we need to watch and to save
                        this.fields = ['facebook', 'twitter', 'facebookAppId'];

                        // the checkboxes we need to watch and to save.
                        this.checkboxes = ['facebook', 'twitter'];

                        this.values = {};

                        this.settingsPrefix = 'radixio.sharing';

                        // get the saved settings from the database
                        var settings = app.data.settings;

                        // bind the values of the fields and checkboxes to the getter/setter functions
                        this.fields.forEach(function (key) {
                            return _this2.values[key] = m.prop(settings[_this2.addPrefix(key)]);
                        });
                        this.checkboxes.forEach(function (key) {
                            return _this2.values[key] = m.prop(settings[_this2.addPrefix(key)] === '1');
                        });
                    }
                }, {
                    key: "view",
                    value: function view() {
                        return [m('div', { className: 'SharingPage' }, [m('div', { className: 'container' }, [m('form', { onsubmit: this.onsubmit.bind(this) }, [m('fieldset', {}, [m('legend', {}, app.translator.trans('radixio-sharing.admin.labels.facebook.title')), m('label', {}, app.translator.trans('radixio-sharing.admin.labels.facebook.client_id')), m('input', {
                            className: 'FormControl',
                            value: this.values.facebookAppId() || '',
                            oninput: m.withAttr('value', this.values.facebookAppId)
                        })]), m('fieldset', {}, [m('legend', {}, app.translator.trans('radixio-sharing.admin.labels.preferences.title')), Switch.component({
                            state: this.values.facebook() || false,
                            children: 'Facebook',
                            onchange: this.values.facebook
                        })]), m('fieldset', {}, [Switch.component({
                            state: this.values.twitter() || false,
                            children: 'Twitter',
                            onchange: this.values.twitter
                        })]), Button.component({
                            type: 'submit',
                            className: 'Button Button--primary',
                            children: app.translator.trans('radixio-sharing.admin.buttons.save'),
                            loading: this.loading,
                            disabled: false
                        })])])])];
                    }
                }, {
                    key: "onsubmit",
                    value: function onsubmit(e) {
                        var _this3 = this;

                        // prevent the usual form submit behaviour
                        e.preventDefault();

                        // if the page is already saving, do nothing
                        if (this.loading) return;

                        // prevents multiple savings
                        this.loading = true;

                        // remove previous success popup
                        app.alerts.dismiss(this.successAlert);

                        var settings = {};

                        // gets all the values from the form
                        this.fields.forEach(function (key) {
                            return settings[_this3.addPrefix(key)] = _this3.values[key]();
                        });
                        this.checkboxes.forEach(function (key) {
                            return settings[_this3.addPrefix(key)] = _this3.values[key]();
                        });

                        // actually saves everything in the database
                        saveSettings(settings).then(function () {
                            // on success, show popup
                            app.alerts.show(_this3.successAlert = new Alert({
                                type: 'success',
                                children: app.translator.trans('core.admin.basics.saved_message')
                            }));
                        }).catch(function () {}).then(function () {
                            // return to the initial state and redraw the page
                            _this3.loading = false;
                            m.redraw();
                        });
                    }
                }, {
                    key: "addPrefix",
                    value: function addPrefix(key) {
                        return this.settingsPrefix + '.' + key;
                    }
                }]);
                return SharingConfigPage;
            }(Component);

            _export("default", SharingConfigPage);
        }
    };
});;
'use strict';

System.register('radixi0/sharing/main', ['flarum/app', 'radixi0/sharing/addSharingConfigPane'], function (_export, _context) {
    "use strict";

    var app, addSharingConfigPane;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_radixi0SharingAddSharingConfigPane) {
            addSharingConfigPane = _radixi0SharingAddSharingConfigPane.default;
        }],
        execute: function () {

            app.initializers.add('flarum-ext-sharing', function (app) {
                addSharingConfigPane();
            });
        }
    };
});