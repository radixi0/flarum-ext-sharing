import app from 'flarum/app';
import addSharingConfigPane from 'radixi0/sharing/addSharingConfigPane';

app.initializers.add('flarum-ext-sharing', app => {
    addSharingConfigPane();
});
