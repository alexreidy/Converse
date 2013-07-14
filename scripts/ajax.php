<?php
require "database.php";

function clean($string) {
    return mysql_real_escape_string(strip_tags($string, '<a>'));
}

switch($_POST['action']) {
    case 'send':
        $sender = clean($_POST['sender']);
        $message = clean($_POST['message']);
        if ($sender != "" && $message != "")
            $sent = mysql_query(" INSERT INTO messages (sender, message) VALUES ('{$sender}', '{$message}'); ", $conn);
        if ($sent) echo("sent");
        break;
        
    case 'get_num_rows':
        echo(mysql_num_rows(mysql_query(" SELECT * FROM messages; "))); 
        break;
        
    case 'request':
        $current = clean($_POST['current']);
        $next = $current++;
        $success = false;
        
        for ($i = 0; $i < 25; $i++) {
            if (($result = mysql_query(" SELECT * FROM messages WHERE id={$next}; "))) {
                $row = mysql_fetch_array($result);
                if ($row['sender'] != null && $row['message'] != null) {
                    echo("<p class='name'>" . $row['sender'] . ": </p>" . $row['message']);
                    $success = true;
                    break;
                }
            }
            sleep(1);
        }

        if ( ! $success) echo("timeout");
        break;
}
?>