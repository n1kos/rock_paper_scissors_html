;(function(){
    /**
     *
     * helper functions to handle simple css properties with js
     *
     */    
    function show(id, value) {
        document.getElementById(id).style.display = value ? 'block' : 'none';
    }

    function showOpacity(id, value) {
        document.getElementById(id).style.opacity = value ? '1' : '0';
    }

    function showVisibility(id, value) {
        document.getElementById(id).style.visibility = value ? 'visible' : 'hidden';
    }

    /**
     *
     * cross browser event listener handling
     *
     */    
    function addEvent( obj, type, fn ) {
      if ( obj.attachEvent ) {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
        obj.attachEvent( 'on'+type, obj[type+fn] );
      } else
        obj.addEventListener( type, fn, false );
    }
    function removeEvent( obj, type, fn ) {
      if ( obj.detachEvent ) {
        obj.detachEvent( 'on'+type, obj[type+fn] );
        obj[type+fn] = null;
      } else
        obj.removeEventListener( type, fn, false );
    }

    /**
      *
      * forEach method, could be shipped as part of an Object Literal/Module
      *
      */      
    var forEach = function (array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]); // passes back stuff we need
      }
    };

    /**
     *
     * register listenr, run, forget
     *
     */
    function once(target, type, listener, useCapture) {
        var capture = !!useCapture;
        
        addEvent(target, type, handler, capture);

        function deregister() {
            removeEvent(target, type, handler, capture);
        }

        function handler() {
            deregister();
            return listener.apply(this, arguments);
        }

        return deregister;
    }

    /**
     *
     * make any node list to animate its elements one by one. removes listeners when done
     *
     */    
    function animateItemsSequence (parentNodeClass, animationType, finalCallback) {
        var myNodeList = document.getElementsByClassName(parentNodeClass)[0].children;
        
        /* named function so it can be removed from the listener */       
        var boundFunction = function (index, value) {
            // value.classList.remove("animated");
            try {
                myNodeList[index+1].classList.add("animated", typeof animationType == "string" ? animationType : animationType[index+1]);
            }
            catch (err) {
                try {
                    finalCallback();
                } catch (errr) {
                    //
                }
                console.log('out of elements');
            }
            // removeEvent(value, "animationend", arguments.callee);
        };

        /*  loop thru each element and add cross-browser event listener for animation end */        
        forEach(myNodeList, function (index, value) {
            // console.log(index, value); // passes index + value back!
            if (index == 0) {
                value.classList.add("animated", typeof animationType == "string" ? animationType : animationType[index]);
            }
            once(value, "animationend", boundFunction.bind(this, index, value));
            // addEvent(value, "animationend", boundFunction.bind(this, index, value));
            // removeEvent(value, "animationend", boundFunction);
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

    onReady(function () {

        var TV = {
            isLoading : true
        };


        TV.init = function() {
            this.load();
        };

        TV.load = function () {
            var t = this;
            show('ip-content', true);
            show('ip-loading', false);            
            showOpacity('ip-main-wrapper', false);
            t.isLoading = false;
            t.showHomePage();
        };
        
        TV.showHomePage = function () {
            var t = this;
            window.setTimeout(function(){
                document.getElementById('ip-bg-audio').play();
                document.getElementsByClassName("ip-tv")[0].classList.add("ip-is-loaded");
                showOpacity('ip-main-wrapper', true);
                document.getElementById("ip-content").classList.remove("ip-is-hidden");
                animateItemsSequence("ip-logo", ["fadeIn", "bounceInDown", "fadeIn", "bounceInDown" ,"fadeIn", "bounceInDown"]);
            }, 300);
        };

        TV.init();
    });    
})();