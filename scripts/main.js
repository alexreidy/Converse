var initializing = true;
var waitingOnName = true;
var name = "Anonymous";
var currentMessage = 1;
var nextMessage;
var currentDiv;
var timeouts = 0;
var failed = false;
var finished = true;
var total = 0;
var interval;

$('document').ready(function() {
    $('div.chat').hide();
    
    $('#msgBox').click(function() {
        if (waitingOnName) {
            $('#msgBox').val('');
        }
    });
    
    // Count messages
    $.post('scripts/ajax.php', { action: 'get_num_rows' }, function(num) {
        total = num;
    });
    
    interval = setInterval(request, 10);
    $('div.chat').fadeIn(5000);
    
    // Send message
    $('#msgBox').keypress(function(e) {
        if (e.which == 13) {
            var msg = $('#msgBox').val();
            if (waitingOnName) {
                $('#msgBox').val('');
                waitingOnName = false;
                name = msg;
            } else {
                $.post('scripts/ajax.php', { action: 'send', sender: name, message: msg }, function(x) {
                    $('#msgBox').val('');
                });     
            }
        }
    });
    
    // Request new message and handle related processes
    function request() {
        if (finished) {
            if (!initializing && !failed) {
                nextMessage = currentMessage + 1;
                currentDiv = nextMessage;
                $('div.chat').prepend("<div class='msg' id='" + nextMessage + "'>" + nextMessage + "</div>");
                $("#" + nextMessage).hide();
            }
            
            finished = false;
            $.post('scripts/ajax.php', { action: 'request', current: currentMessage }, function(received) {
                if (received != "" && received != "timeout") {
                    if (!initializing) {
                        $("#" + nextMessage).html(received);
                        $("#" + nextMessage).slideDown(500);
                        timeouts = 1;
                    } else {
                        $('div.chat').prepend("<div class='msg'>" + received + "</div>");
                    }
                    
                    if (initializing && currentMessage > total) {
                        initializing = false;
                        clearInterval(interval);
                        interval = setInterval(request, 500);
                    }
                    currentMessage++;
                    finished = true;
                    failed = false;
                }
                
                if (received == "timeout") {
                    finished = true;
                    failed = true;
                    timeouts++;
                }
            });
            
            if (timeouts > 0) {
                var time = timeouts * 500;
                clearInterval(interval);
                interval = setInterval(request, time);
                console.log(time/1000);
            }
        }
    }
});

