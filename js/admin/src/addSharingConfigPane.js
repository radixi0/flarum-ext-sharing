import app from 'flarum/app';
import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';
import SharingConfigPage from 'radixi0/sharing/components/SharingConfigPage';

export default function() {
    app.routes.sharing = {path: '/sharing', component: SharingConfigPage.component()};

    app.extensionSettings['radixio-sharing-list'] = () => m.route(app.route('sharing'));

    extend(AdminNav.prototype, 'items', items => {
        items.add('sharing', AdminLinkButton.component({
            href: app.route('sharing'),
            icon: 'share-alt-square',
            children: app.translator.trans('radixio-sharing.admin.nav.sharing_button'),
            description: app.translator.trans('radixio-sharing.admin.nav.sharing_text')
        }));
    });
}