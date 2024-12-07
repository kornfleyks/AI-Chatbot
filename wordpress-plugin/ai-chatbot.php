<?php
/*
Plugin Name: AI Chatbot
Description: React-based AI Chatbot powered by Chatbase
Version: 1.0
Author: Your Name
*/

// Prevent direct access to this file
if (!defined('ABSPATH')) {
    exit;
}

// Function to enqueue scripts and styles
function ai_chatbot_enqueue_scripts() {
    // Get the plugin directory URL
    $plugin_url = plugin_dir_url(__FILE__);
    
    // Enqueue the main CSS file
    wp_enqueue_style(
        'ai-chatbot-styles',
        $plugin_url . 'build/static/css/main.css',
        array(),
        '1.0'
    );

    // Enqueue the main JS file
    wp_enqueue_script(
        'ai-chatbot-js',
        $plugin_url . 'build/static/js/main.js',
        array(),
        '1.0',
        true
    );

    // Pass environment variables to JavaScript
    wp_localize_script(
        'ai-chatbot-js',
        'aiChatbotEnv',
        array(
            'REACT_APP_CHATBASE_API_KEY' => get_option('ai_chatbot_api_key'),
            'REACT_APP_CHATBOT_ID' => get_option('ai_chatbot_id')
        )
    );
}
add_action('wp_enqueue_scripts', 'ai_chatbot_enqueue_scripts');

// Function to register the shortcode
function ai_chatbot_shortcode() {
    return '<div id="root"></div>';
}
add_shortcode('ai-chatbot', 'ai_chatbot_shortcode');

// Add admin menu
function ai_chatbot_admin_menu() {
    add_options_page(
        'AI Chatbot Settings',
        'AI Chatbot',
        'manage_options',
        'ai-chatbot-settings',
        'ai_chatbot_settings_page'
    );
}
add_action('admin_menu', 'ai_chatbot_admin_menu');

// Register settings
function ai_chatbot_register_settings() {
    register_setting('ai_chatbot_options', 'ai_chatbot_api_key');
    register_setting('ai_chatbot_options', 'ai_chatbot_id');
}
add_action('admin_init', 'ai_chatbot_register_settings');

// Create the settings page
function ai_chatbot_settings_page() {
    ?>
    <div class="wrap">
        <h2>AI Chatbot Settings</h2>
        <form method="post" action="options.php">
            <?php settings_fields('ai_chatbot_options'); ?>
            <?php do_settings_sections('ai_chatbot_options'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row">Chatbase API Key</th>
                    <td>
                        <input type="text" name="ai_chatbot_api_key" 
                               value="<?php echo esc_attr(get_option('ai_chatbot_api_key')); ?>" 
                               class="regular-text" />
                    </td>
                </tr>
                <tr>
                    <th scope="row">Chatbot ID</th>
                    <td>
                        <input type="text" name="ai_chatbot_id" 
                               value="<?php echo esc_attr(get_option('ai_chatbot_id')); ?>" 
                               class="regular-text" />
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
        <div class="ai-chatbot-usage">
            <h3>How to Use</h3>
            <p>Use this shortcode to display the chatbot on any page or post:</p>
            <code>[ai-chatbot]</code>
        </div>
    </div>
    <?php
}
