<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class SettingApp extends Settings
{

    public string $name;

    public ?string $logo_url = null;

    public static function group(): string
    {
        return 'app';
    }
}
