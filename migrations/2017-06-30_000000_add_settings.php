<?php
namespace radixi0\sharing\Migration;

use Illuminate\Database\ConnectionInterface;

return [
    'up' => function (ConnectionInterface $db) {
        $db->table('settings')->insert([
            'key' => 'radixio.sharing.list',
            'value' => '["facebook","twitter"]'
        ]);

        $db->table('settings')->insert([
            'key' => 'radixio.sharing.facebook',
            'value' => '0'
        ]);

        $db->table('settings')->insert([
            'key' => 'radixio.sharing.twitter',
            'value' => '0'
        ]);
    },

    'down' => function (ConnectionInterface $db) {
        $db->table('settings')->where('key', 'radixio.sharing.list')->delete();
        $db->table('settings')->where('key', 'radixio.sharing.facebook')->delete();
        $db->table('settings')->where('key', 'radixio.sharing.twitter')->delete();
    }
];