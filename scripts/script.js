;(function(){
    var pfx = ["webkit", "moz", "MS", "o", ""];
    function PrefixedEvent(element, type, callback) {
        for (var p = 0; p < pfx.length; p++) {
            if (!pfx[p]) type = type.toLowerCase();
            element.addEventListener(pfx[p]+type, callback, false);
        }
    };

    // forEach method, could be shipped as part of an Object Literal/Module
    var forEach = function (array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]); // passes back stuff we need
      }
    };

    function animateItemsSequence (parentNodeClass, animationType) {
        var myNodeList = document.getElementsByClassName(parentNodeClass)[0].children;
        
        forEach(myNodeList, function (index, value) {
            // console.log(index, value); // passes index + value back!
            if (index == 0) {
                value.classList.add("animated", animationType);
            }
            PrefixedEvent(value, "animationend", function(){
                // value.classList.remove("animated", animationType);
                try {
                    myNodeList[index+1].classList.add("animated", animationType);
                }
                catch (err) {
                    console.log('out of elements');
                }
                value.removeEventListener(animationType, arguments.callee);
            });
        });
    };

    function onReady(callback) {
        var intervalID = window.setInterval(checkReady, 1000);

        function checkReady() {
            if (document.getElementsByTagName('body')[0] !== undefined) {
                window.clearInterval(intervalID);
                callback.call(this);
            }
        }
    }

    function show(id, value) {
        document.getElementById(id).style.display = value ? 'block' : 'none';
    }

    function showOpacity(id, value) {
        document.getElementById(id).style.opacity = value ? '1' : '0';
    }

    function showVisibility(id, value) {
        document.getElementById(id).style.visibility = value ? 'visible' : 'hidden';
    }

    onReady(function () {
        show('ip-content', true);
        show('ip-loading', false);
        showOpacity('ip-main-wrapper', false);
        window.setTimeout(function(){
            document.getElementsByClassName("ip-tv")[0].classList.add("ip-is-loaded");
            showOpacity('ip-main-wrapper', true);
            document.getElementById("ip-content").classList.remove("ip-is-hidden");
            animateItemsSequence("ip-logo", "fadeIn");
        }, 300);

    });    
})();