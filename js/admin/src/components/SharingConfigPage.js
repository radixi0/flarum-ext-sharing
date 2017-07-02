import Component from "flarum/Component";
import Button from "flarum/components/Button";
import saveSettings from "flarum/utils/saveSettings";
import Alert from "flarum/components/Alert";
import Switch from "flarum/components/Switch";

export default class SharingConfigPage extends Component {
    init() {
        super.init();

        this.loading = false;

        // the fields we need to watch and to save
        this.fields = [
           'facebook',
           'twitter',
           'facebookAppId'
        ];

        // the checkboxes we need to watch and to save.
        this.checkboxes = [
           'facebook',
           'twitter'
        ];

        this.values = {};

        this.settingsPrefix = 'radixio.sharing';

        // get the saved settings from the database
        const settings = app.data.settings;
        
        // bind the values of the fields and checkboxes to the getter/setter functions
        this.fields.forEach(key =>
            this.values[key] = m.prop(settings[this.addPrefix(key)])
        );
        this.checkboxes.forEach(key =>
            this.values[key] = m.prop(settings[this.addPrefix(key)] === '1')
        );
    }

    view() {
        return [
            m('div', {className: 'SharingPage'}, [
                m('div', {className: 'container'}, [
                    m('form', {onsubmit: this.onsubmit.bind(this)}, [                        
                        m('fieldset', {}, [
                            m('legend', {}, app.translator.trans('radixio-sharing.admin.labels.facebook.title')),
                            m('label', {}, app.translator.trans('radixio-sharing.admin.labels.facebook.client_id')),
                            m('input', {
                                className: 'FormControl',
                                value: this.values.facebookAppId() || '',
                                oninput: m.withAttr('value', this.values.facebookAppId)
                            }),
                        ]),
                        m('fieldset', {}, [
                            m('legend', {}, app.translator.trans('radixio-sharing.admin.labels.preferences.title')),
                            Switch.component({
                                state: this.values.facebook() || false,
                                children: 'Facebook',
                                onchange: this.values.facebook
                            })
                        ]),            
                        m('fieldset', {}, [
                            Switch.component({
                                state: this.values.twitter() || false,
                                children: 'Twitter',
                                onchange: this.values.twitter
                            }),
                        ]),                                          
                        Button.component({
                            type: 'submit',
                            className: 'Button Button--primary',
                            children: app.translator.trans('radixio-sharing.admin.buttons.save'),
                            loading: this.loading,
                            disabled: false
                        }),
                    ])
                ])
            ])
        ];
    }

    /**
     * Saves the settings to the database and redraw the page
     *
     * @param e
     */
    onsubmit(e) {
        // prevent the usual form submit behaviour
        e.preventDefault();

        // if the page is already saving, do nothing
        if (this.loading) return;

        // prevents multiple savings
        this.loading = true;

        // remove previous success popup
        app.alerts.dismiss(this.successAlert);

        const settings = {};

        // gets all the values from the form
        this.fields.forEach(key => settings[this.addPrefix(key)] = this.values[key]());
        this.checkboxes.forEach(key => settings[this.addPrefix(key)] = this.values[key]());

        // actually saves everything in the database
        saveSettings(settings)
            .then(() => {
                // on success, show popup
                app.alerts.show(this.successAlert = new Alert({
                    type: 'success',
                    children: app.translator.trans('core.admin.basics.saved_message')
                }));
            })
            .catch(() => {
            })
            .then(() => {
                // return to the initial state and redraw the page
                this.loading = false;
                m.redraw();
            });
    }

    /**
     * Adds the prefix `this.settingsPrefix` at the beginning of `key`
     *
     * @returns string
     */
    addPrefix(key) {
        return this.settingsPrefix + '.' + key;
    }
}