import Dropdown from 'flarum/components/Dropdown';
import Button from 'flarum/components/Button';
import { truncate } from 'flarum/utils/string'
import { getPlainContent } from 'flarum/utils/string'
import icon from 'flarum/helpers/icon';
import extractText from 'flarum/utils/extractText';

import ShareModal from 'radixi0/sharing/components/ShareModal';
import SharingMenuItem from 'radixi0/sharing/components/SharingMenuItem';

export default class SharingMenu extends Dropdown {
  init() {
    
    this.enabledNetworks = this.props.enabledNetworks;
    this.discussion = this.props.discussion;

     this.options = this.enabledNetworks.map(function (social){
       return {
         network: social,
         icon: social,
         label: social
       }
     })
  }

  view() {

    this.enabledNetworks = this.props.enabledNetworks;
    this.discussion = this.props.discussion;
    var share_url = app.forum.attribute('baseUrl') + '/d/' + this.discussion.id() + '-' + this.discussion.slug();
    var share_title = app.title;
    var share_description = this.discussion.startPost() ? encodeURIComponent(truncate(getPlainContent(this.discussion.startPost().contentHtml()), 150, 0)) : '';
    const width = 1000;
    const height = 500;
    const top = $(window).height() / 2 - height / 2;
    const left = $(window).width() / 2 - width / 2;
    const window_params = 'width=' + width + ', height= ' + height + ', top=' + top + ', left=' + left + ', status=no, scrollbars=no, resizable=no';

    let buttonLabel = app.translator.trans('radixio-sharing.forum.share_button');
    const buttonClass = 'ButtonGroup Dropdown';
    const buttonProps = {
      className: 'Button ' + buttonClass,
      children: buttonLabel,
      title: ''
    };

    return (
      <div className="Dropdown ButtonGroup">
        {Button.component(buttonProps)}

        <button className={'Dropdown-toggle Button Button--icon ' + buttonClass} data-toggle="dropdown">
          {icon('caret-down', {className: 'Button-icon'})}
        </button>

        <ul className="Dropdown-menu dropdown-menu Dropdown-menu--right">
          { 
            this.options.map(props => {            
                switch (props.network)
                {
                  case 'facebook':                    
                    props.onclick = function () {
                      FB.ui({
                        method: 'share',
                        href: share_url
                      }, function(response){});
                    };
                    break;
                  case 'twitter':                  
                    props.onclick = function () {
                      window.open('//twitter.com/share?url=' + share_url + '&text=' + share_title, app.title, window_params);
                    };
                    break;
                }                

              return <li>{SharingMenuItem.component(props)}</li>;
            })
          }
        </ul>
      </div>
    );
  }
}
