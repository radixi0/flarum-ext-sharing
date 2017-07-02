import DiscussionPage from 'flarum/components/DiscussionPage';
import Button from 'flarum/components/Button';
import { extend } from 'flarum/extend';

import ShareModal from 'radixi0/sharing/components/ShareModal';
import addMetaTags from 'radixi0/sharing/addMetaTags';
import addSharingMenu from 'radixi0/sharing/addSharingMenu';

app.initializers.add('flarum-ext-sharing', function() {    
    addSharingMenu();
});
