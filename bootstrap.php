<?php
namespace radixi0\sharing;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {    
    $events->subscribe(Listener\AddApiAttributes::class);
    $events->subscribe(Listener\AddClientAssets::class);
    $events->subscribe(Listener\AddOgTags::class);    
};
