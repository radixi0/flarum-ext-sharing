import { extend } from 'flarum/extend';
import Button from 'flarum/components/Button';
import DiscussionPage from 'flarum/components/DiscussionPage';
import DiscussionControls from 'flarum/utils/DiscussionControls';

import SharingMenu from 'radixi0/sharing/components/SharingMenu';

export default function addSharingMenu() {
  extend(DiscussionControls, 'userControls', function(items, discussion, context) {
    if (!context instanceof DiscussionPage) {              
        items.add('sharing', Button.component());      
    }
  });

  extend(DiscussionPage.prototype, 'sidebarItems', function(items) {
    const discussion = this.discussion;
    var enabledNetworks = app.forum.attribute('enabledNetworks') ? JSON.parse(app.forum.attribute('enabledNetworks')) : [];

    if (enabledNetworks.length > 0) {
      items.add('sharing', SharingMenu.component({discussion, enabledNetworks}));    
    }
  });
}