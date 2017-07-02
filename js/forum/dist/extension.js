'use strict';

System.register('radixi0/sharing/addSharingMenu', ['flarum/extend', 'flarum/components/Button', 'flarum/components/DiscussionPage', 'flarum/utils/DiscussionControls', 'radixi0/sharing/components/SharingMenu'], function (_export, _context) {
  "use strict";

  var extend, Button, DiscussionPage, DiscussionControls, SharingMenu;
  function addSharingMenu() {
    extend(DiscussionControls, 'userControls', function (items, discussion, context) {
      if (!context instanceof DiscussionPage) {
        items.add('sharing', Button.component());
      }
    });

    extend(DiscussionPage.prototype, 'sidebarItems', function (items) {
      var discussion = this.discussion;
      var enabledNetworks = app.forum.attribute('enabledNetworks') ? JSON.parse(app.forum.attribute('enabledNetworks')) : [];

      if (enabledNetworks.length > 0) {
        items.add('sharing', SharingMenu.component({ discussion: discussion, enabledNetworks: enabledNetworks }));
      }
    });
  }

  _export('default', addSharingMenu);

  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumComponentsDiscussionPage) {
      DiscussionPage = _flarumComponentsDiscussionPage.default;
    }, function (_flarumUtilsDiscussionControls) {
      DiscussionControls = _flarumUtilsDiscussionControls.default;
    }, function (_radixi0SharingComponentsSharingMenu) {
      SharingMenu = _radixi0SharingComponentsSharingMenu.default;
    }],
    execute: function () {}
  };
});;
'use strict';

System.register('radixi0/sharing/components/SharingMenu', ['flarum/components/Dropdown', 'flarum/components/Button', 'flarum/utils/string', 'flarum/helpers/icon', 'flarum/utils/extractText', 'radixi0/sharing/components/ShareModal', 'radixi0/sharing/components/SharingMenuItem'], function (_export, _context) {
  "use strict";

  var Dropdown, Button, truncate, getPlainContent, icon, extractText, ShareModal, SharingMenuItem, SharingMenu;
  return {
    setters: [function (_flarumComponentsDropdown) {
      Dropdown = _flarumComponentsDropdown.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumUtilsString) {
      truncate = _flarumUtilsString.truncate;
      getPlainContent = _flarumUtilsString.getPlainContent;
    }, function (_flarumHelpersIcon) {
      icon = _flarumHelpersIcon.default;
    }, function (_flarumUtilsExtractText) {
      extractText = _flarumUtilsExtractText.default;
    }, function (_radixi0SharingComponentsShareModal) {
      ShareModal = _radixi0SharingComponentsShareModal.default;
    }, function (_radixi0SharingComponentsSharingMenuItem) {
      SharingMenuItem = _radixi0SharingComponentsSharingMenuItem.default;
    }],
    execute: function () {
      SharingMenu = function (_Dropdown) {
        babelHelpers.inherits(SharingMenu, _Dropdown);

        function SharingMenu() {
          babelHelpers.classCallCheck(this, SharingMenu);
          return babelHelpers.possibleConstructorReturn(this, (SharingMenu.__proto__ || Object.getPrototypeOf(SharingMenu)).apply(this, arguments));
        }

        babelHelpers.createClass(SharingMenu, [{
          key: 'init',
          value: function init() {

            this.enabledNetworks = this.props.enabledNetworks;
            this.discussion = this.props.discussion;

            this.options = this.enabledNetworks.map(function (social) {
              return {
                network: social,
                icon: social,
                label: social
              };
            });
          }
        }, {
          key: 'view',
          value: function view() {

            this.enabledNetworks = this.props.enabledNetworks;
            this.discussion = this.props.discussion;
            var share_url = app.forum.attribute('baseUrl') + '/d/' + this.discussion.id() + '-' + this.discussion.slug();
            var share_title = app.title;
            var share_description = this.discussion.startPost() ? encodeURIComponent(truncate(getPlainContent(this.discussion.startPost().contentHtml()), 150, 0)) : '';
            var width = 1000;
            var height = 500;
            var top = $(window).height() / 2 - height / 2;
            var left = $(window).width() / 2 - width / 2;
            var window_params = 'width=' + width + ', height= ' + height + ', top=' + top + ', left=' + left + ', status=no, scrollbars=no, resizable=no';

            var buttonLabel = app.translator.trans('radixio-sharing.forum.share_button');
            var buttonClass = 'ButtonGroup Dropdown';
            var buttonProps = {
              className: 'Button ' + buttonClass,
              children: buttonLabel,
              title: ''
            };

            return m(
              'div',
              { className: 'Dropdown ButtonGroup' },
              Button.component(buttonProps),
              m(
                'button',
                { className: 'Dropdown-toggle Button Button--icon ' + buttonClass, 'data-toggle': 'dropdown' },
                icon('caret-down', { className: 'Button-icon' })
              ),
              m(
                'ul',
                { className: 'Dropdown-menu dropdown-menu Dropdown-menu--right' },
                this.options.map(function (props) {
                  switch (props.network) {
                    case 'facebook':
                      props.onclick = function () {
                        FB.ui({
                          method: 'share',
                          href: share_url
                        }, function (response) {});
                      };
                      break;
                    case 'twitter':
                      props.onclick = function () {
                        window.open('//twitter.com/share?url=' + share_url + '&text=' + share_title, app.title, window_params);
                      };
                      break;
                  }

                  return m(
                    'li',
                    null,
                    SharingMenuItem.component(props)
                  );
                })
              )
            );
          }
        }]);
        return SharingMenu;
      }(Dropdown);

      _export('default', SharingMenu);
    }
  };
});;
'use strict';

System.register('radixi0/sharing/components/SharingMenuItem', ['flarum/Component', 'flarum/helpers/icon'], function (_export, _context) {
  "use strict";

  var Component, icon, SharingMenuItem;
  return {
    setters: [function (_flarumComponent) {
      Component = _flarumComponent.default;
    }, function (_flarumHelpersIcon) {
      icon = _flarumHelpersIcon.default;
    }],
    execute: function () {
      SharingMenuItem = function (_Component) {
        babelHelpers.inherits(SharingMenuItem, _Component);

        function SharingMenuItem() {
          babelHelpers.classCallCheck(this, SharingMenuItem);
          return babelHelpers.possibleConstructorReturn(this, (SharingMenuItem.__proto__ || Object.getPrototypeOf(SharingMenuItem)).apply(this, arguments));
        }

        babelHelpers.createClass(SharingMenuItem, [{
          key: 'view',
          value: function view() {
            return m(
              'button',
              { className: 'SubscriptionMenuItem hasIcon', onclick: this.props.onclick },
              m(
                'span',
                { className: 'SubscriptionMenuItem-label' },
                icon(this.props.icon, { className: 'Button-icon' }),
                m(
                  'strong',
                  null,
                  this.props.label
                )
              )
            );
          }
        }]);
        return SharingMenuItem;
      }(Component);

      _export('default', SharingMenuItem);
    }
  };
});;
'use strict';

System.register('radixi0/sharing/main', ['flarum/components/DiscussionPage', 'flarum/components/Button', 'flarum/extend', 'radixi0/sharing/components/ShareModal', 'radixi0/sharing/addMetaTags', 'radixi0/sharing/addSharingMenu'], function (_export, _context) {
    "use strict";

    var DiscussionPage, Button, extend, ShareModal, addMetaTags, addSharingMenu;
    return {
        setters: [function (_flarumComponentsDiscussionPage) {
            DiscussionPage = _flarumComponentsDiscussionPage.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_radixi0SharingComponentsShareModal) {
            ShareModal = _radixi0SharingComponentsShareModal.default;
        }, function (_radixi0SharingAddMetaTags) {
            addMetaTags = _radixi0SharingAddMetaTags.default;
        }, function (_radixi0SharingAddSharingMenu) {
            addSharingMenu = _radixi0SharingAddSharingMenu.default;
        }],
        execute: function () {

            app.initializers.add('flarum-ext-sharing', function () {
                addSharingMenu();
            });
        }
    };
});