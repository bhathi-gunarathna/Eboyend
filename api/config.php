<?php

error_reporting(E_ALL);
ini_set('display_errors', '0');

define('SITE_NAME', 'Movie Library');

define('DATA_DIR', __DIR__ . '/data');

$admin_emails = [
    'dumidu.kodithuwakku@ebeyonds.com',
    'prabhath.senadheera@ebeyonds.com'
];
define('ADMIN_EMAILS', $admin_emails);

define('EMAIL_FROM', 'noreply@movielibrary.test');

define('ALLOWED_ORIGINS', [
    'http://localhost',
    'http://localhost:3000',
    'http://localhost:8080'
]);
