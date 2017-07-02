<?php
namespace radixi0\sharing\Listener;

use Flarum\Api\Controller\ListDiscussionsController;
use Flarum\Api\Controller\ShowDiscussionController;
use Flarum\Api\Controller\ShowUserController;
use Flarum\Event\ConfigureClientView;
use Flarum\Event\PrepareApiData;
use Flarum\Forum\UrlGenerator;
use Flarum\Http\Controller\ClientView;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;

class AddOgTags 
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var UrlGenerator
     */
    protected $urlGenerator;

    /**
     * @var ClientView
     */
    protected $clientView;

    /**
     * @var ogData
     */
    protected $ogData;

    public function __construct(SettingsRepositoryInterface $settings, UrlGenerator $urlGenerator) {
        $this->settings = $settings;
        $this->urlGenerator = $urlGenerator;
    }

    /**            
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureClientView::class, [$this, 'getClientView']);
        $events->listen(PrepareApiData::class, [$this, 'addMetaTags']);
    }

    /**
     * @param ConfigureClientView $event
     */
    public function getClientView(ConfigureClientView $event)
    {
        if ($event->isForum()) {
            $this->clientView = $event->view;
            
            $data = [];
            $data['url'] = $this->urlGenerator->toBase();
            $data['title'] = $this->plainText($this->settings->get('welcome_title'), 80);
            $data['description'] = $this->plainText($this->settings->get('forum_description'), 150);

            $this->addOpenGraph([
                'type' => 'article',
                'site_name' => $this->settings->get('forum_title'),
                'image' => ''
            ]);
            $this->addOpenGraph($data);
            $this->addTwitterCard([
                'card' => 'summary',
                'image' => ''
            ]);
            $this->addTwitterCard($data);
            $this->addFacebookApi();                        
        }
    }

    /**
     * @param PrepareApiData $event
     */
    public function addMetaTags(PrepareApiData $event)
    {
        if ($this->clientView){

            $data = [];
            $data['url'] = $this->urlGenerator->toRoute('discussion', ['id' => $this->ogData->id . '-' . $this->ogData->slug]);   
            $data['title'] = $this->plainText($this->ogData->title, 80);
            $post_id = $event->request->getQueryParams()['page']['near'];
            $pattern = '/!\[(.*)\]\s?\((.*)(.png|.gif|.jpg|.jpeg)(.*)\)/';

            if ($post_id === null) { 
                
                $data['description'] = $this->ogData->startPost ? $this->plainText(preg_replace($pattern, '', $this->ogData->startPost->content), 150) : '';
                
                if(preg_match($pattern,$this->ogData->startPost->content, $matches))
                {
                    $data['image'] = $matches[2] . $matches[3];
                }

            } else {
                
                $post = array_key_exists((int)$post_id - 1, $this->ogData->posts) ? $this->ogData->posts[(int)$post_id - 1] : null;
                $data['url'] .= '/' . $post_id;
                if ($post) {
                    $data['description'] = $this->plainText(preg_replace($pattern, '', $post->content), 150);                    
                } else {
                    $data['description'] = $this->ogData->startPost ? $this->plainText(preg_replace($pattern, '',$this->ogData->startPost->content), 150) : '';
                }
            }

            // if no images found
            if ($data['image'] == ''){
                $data['image'] = $this->urlGenerator->toBase() . '/assets/' . $this->settings->get('logo_path');
            }

            $this->addOpenGraph($data);
            $this->addTwitterCard($data);
        } else {
            $this->ogData = $event->data;
        }                            
    }

    /**
     * @param array $data
     */
    public function addOpenGraph(array $data = [])
    {
        foreach ($data as $key => $value) {
            $this->clientView->addHeadString('<meta property="og:' . $key . '" content="' . $value . '"/>', 'og_' . $key . '');
        }     
    }

    /**
     * @param array $data
     */
    public function addTwitterCard(array $data = [])
    {
        foreach ($data as $key => $value) {
            $this->clientView->addHeadString('<meta property="twitter:' . $key . '" content="' . $value . '"/>', 'twitter_' . $key . '');
        }
    }

    /**
     * @return string
     */
    public function addFacebookApi() 
    {
        if ($this->clientView)
        {
            $this->clientView->addHeadString(str_replace('{0}', 
                                            $this->settings->get('radixio.sharing.facebookAppId'),
                                            '<script>
                                                window.fbAsyncInit = function() {
                                                    FB.init({
                                                    appId            : \'{0}\',
                                                    autoLogAppEvents : true,
                                                    xfbml            : true,
                                                    version          : \'v2.9\'
                                                    });
                                                    FB.AppEvents.logPageView();
                                                };

                                                (function(d, s, id){
                                                    var js, fjs = d.getElementsByTagName(s)[0];
                                                    if (d.getElementById(id)) {return;}
                                                    js = d.createElement(s); js.id = id;
                                                    js.src = "//connect.facebook.net/en_US/sdk.js";
                                                    fjs.parentNode.insertBefore(js, fjs);
                                                }(document, \'script\', \'facebook-jssdk\'));
                                            </script>'));
        }
    }

    /**
     * @param string $text
     * @param int|null $length
     * @return string
     */
    protected function plainText($text, $length = null)
    {
        $text = strip_tags($text);
        $text = preg_replace('/\s+/', ' ', $text);
        $text = trim($text);
        $text = htmlspecialchars($text, ENT_QUOTES|ENT_HTML5|ENT_DISALLOWED|ENT_SUBSTITUTE, 'UTF-8');
        if ($length !== null) {
            $text = mb_strlen($text, 'UTF-8') > $length ? mb_substr($text, 0, $length, 'UTF-8') . '...' : $text;
        }

        return $text;
    }
}