import app from 'flarum/app';
import DiscussionPage from 'flarum/components/DiscussionPage';

import { extend } from 'flarum/extend';
import { truncate } from 'flarum/utils/string';
import { getPlainContent } from 'flarum/utils/string';

export default function() {
    extend(DiscussionPage.prototype, 'show', function() {

        var title = this.discussion.title();
        var url = app.forum.attribute('baseUrl') + '/d/' + this.discussion.id();
        var description = '';

        if (this.discussion.startPost()) {
            description = truncate(getPlainContent(this.discussion.startPost().contentHtml()), 150, 0).replace(/\s+/, ' ').trim();
        }

        $('meta[property=description]').attr('content', description);
        $('meta[property=og\\:title]').attr('content', title);
        $('meta[property=og\\:url]').attr('content', url);
        $('meta[property=og\\:description]').attr('content', description);
        $('meta[property=twitter\\:title]').attr('content', title);
        $('meta[property=twitter\\:url]').attr('content', url);
        $('meta[property=twitter\\:description]').attr('content', description);
        
        if (this.discussion.startPost()) {
            description = truncate(getPlainContent(this.discussion.startPost().contentHtml()), 150, 0).replace(/\s+/, ' ').trim();
        }

        $('meta[property=description]').attr('content', description);
        $('meta[property=og\\:title]').attr('content', title);
        $('meta[property=og\\:url]').attr('content', url);
        $('meta[property=og\\:description]').attr('content', description);
    
        $('meta[property=twitter\\:title]').attr('content', title);
        $('meta[property=twitter\\:url]').attr('content', url);
        $('meta[property=twitter\\:description]').attr('content', description);
    
    });

    extend(DiscussionPage.prototype, 'onunload', function() {
        if (this.discussion) {
            const idParam = m.route.param('id');

            if (!idParam || (idParam && idParam.split('-')[0] !== this.discussion.id())) {
                
                var title = app.forum.attribute('welcomeTitle');
                var url = app.forum.attribute('baseUrl');
                var description = app.forum.attribute('description');

                $('meta[property=description]').attr('content', description);
                $('meta[property=og\\:title]').attr('content', title);
                $('meta[property=og\\:url]').attr('content', url);
                $('meta[property=og\\:description]').attr('content', description);
            
                $('meta[property=twitter\\:title]').attr('content', title);
                $('meta[property=twitter\\:url]').attr('content', url);
                $('meta[property=twitter\\:description]').attr('content', description);
    
            }
        }
    });
}