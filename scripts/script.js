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

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
    };

    function removeEvent( obj, type, fn ) {
      if ( obj.detachEvent ) {
        obj.detachEvent( 'on'+type, obj[type+fn] );
        obj[type+fn] = null;
      } else
        obj.removeEventListener( type, fn, false );
    };

    function findUpTag (el, evt) {
        try {
            if (el.dataset.eventfull != "true") {
                while (el.parentNode) {
                    el = el.parentNode;
                    if (el.dataset.eventfull == "true")
                        return el;
                }
                evt.stopImmediatePropagation();
                return null;
            }
            return el;
        } catch (err) {
            evt.stopImmediatePropagation();
            return null;
        }
    };

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
    function animateItems (nodeClass, animationType, synctype, finalCallback) {
        var myNodeList = document.getElementsByClassName(nodeClass);
        
        /* named function so it can be removed from the listener */       
        var boundFunction = function (index, value) {
            // value.classList.remove("animated");
            //value.className.replace(/animated .*/,"");
            value.classList.remove(value.classList.item(value.classList.length-1));
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
            // value.className.replace(/animated .*/,"");
            
            if (synctype == "sync" ) {
                if (index == 0) {
                    value.classList.add("animated", typeof animationType == "string" ? animationType : animationType[index]);
                } 
                once(value, "animationend", boundFunction.bind(this, index, value));
            } else if (synctype == "async" ) {
                value.classList.add("animated", typeof animationType == "string" ? animationType : animationType[index]);
                value.classList.add("infinite");
            }
            // if (index == 0 && synctype == "sync") {
            //     value.classList.add("animated", typeof animationType == "string" ? animationType : animationType[index]);
            // } else if (synctype == "async" ) {
            //     value.classList.add("animated", typeof animationType == "string" ? animationType : animationType[index]);
            // }

            // if (synctype == "sync" ) {
            //     once(value, "animationend", boundFunction.bind(this, index, value));
            // } else {
            //     value.classList.add("infinite");
            // }
            // addEvent(value, "animationend", boundFunction.bind(this, index, value));
            // removeEvent(value, "animationend", boundFunction);
        });     
                   try {
                finalCallback();
            } catch (errr) {
                //
            }
  
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
            isLoading : true,
            userSelection : "",
            userLastSelection : "",
            cpuSelection : "",
            cpuLastSelection : "",
            currentResult : "",
            isMute : false
        };


        TV.init = function() {
            this.load();
            return this;
        };

        TV.load = function () {
            var t = this;
            show('ip-content', true);
            show('ip-loading', false);            
            showOpacity('ip-main-wrapper', false);
            t.isLoading = false;
            // t.showHomePage();
            return t;
        };
        
        TV.showHomePage = function () {
            var t = this;
            window.setTimeout(function(){
                //document.getElementById('ip-bg-audio').play();
                document.getElementsByClassName("ip-tv")[0].classList.add("ip-is-loaded");
                showOpacity('ip-main-wrapper', true);
                document.getElementById("ip-content").classList.remove("ip-is-hidden");
                animateItems("ip-logo-ops", ["fadeIn", "bounceInDown", "fadeIn", "bounceInDown" ,"fadeIn", "bounceInDown"], "sync");
            }, 300);
            return t;
        };

        TV.addHomePageAnim = function () {
            var t = this;
            animateItems("ip-is-topt", ["bounce", "tada", "wobble"], "async", function() {
                document.getElementsByClassName('ip-button-anim-wrap')[0].className += " animated flash infinite";
            });
            return t;
        };
        
        TV.showGameOptions = function() {
            var t = this;
            return t;
        };

        TV.showSelection = function () {
             var t = this;
             document.getElementsByClassName("ip-is-disappeared")[0].classList.remove("ip-is-disappeared");
             document.getElementsByClassName("ip-logo")[0].classList.add("ip-is-disappeared");
             document.getElementsByClassName("ip-circle")[0].classList.add("ip-has-shadow");
             document.getElementsByClassName("ip-button-play")[0].classList.add("ip-is-disappeared");
             document.getElementsByClassName("ip-button-cancel")[0].classList.remove("ip-is-disappeared");
             return t;
        };

        TV.showMenu = function () {
             var t = this;
             document.getElementsByClassName("ip-select-weapon")[0].classList.add("ip-is-disappeared");
             document.getElementsByClassName("ip-logo")[0].classList.remove("ip-is-disappeared");
             document.getElementsByClassName("ip-circle")[0].classList.remove("ip-has-shadow");
             document.getElementsByClassName("ip-button-play")[0].classList.remove("ip-is-disappeared");
             document.getElementsByClassName("ip-button-cancel")[0].classList.add("ip-is-disappeared");
             return t;
        };

        TV.showCountdown = function () {
             var t = this;
            var aud =  document.getElementById("ip-ui-countdown");
            if (t.isMute) aud.muted = true;
            aud.onended = function() {
                 TV.showGame();
                    // alert("The audio has ended");
            };
             aud.play();
             document.getElementsByClassName("ip-select-weapon")[0].classList.add("ip-is-disappeared");
             document.getElementsByClassName("ip-circle")[0].classList.remove("ip-has-shadow");
             document.getElementsByClassName("ip-button-cancel")[0].classList.add("ip-is-disappeared");
             document.getElementsByClassName("ip-countdown")[0].classList.remove("ip-is-disappeared");
            animateItems("ip-countdown-items", "animamamama", "sync");
             return t;
        };


        TV.showGame = function () {
             var t = this;
             document.getElementsByClassName("ip-countdown")[0].classList.add("ip-is-disappeared");
             document.getElementsByClassName("ip-countdown-tofight")[0].classList.remove("ip-is-disappeared");
             // document.getElementsByClassName("ip-button-cancel")[0].classList.add("ip-is-disappeared");
             document.getElementsByClassName("ip-swipe-left")[0].classList.add("ip-start-swipe-l");
             document.getElementsByClassName("ip-swipe-right")[0].classList.add("ip-start-swipe-r");
            // animateItems("ip-countdown-items", "animamamama", "sync");
            TV.showUserSelection().showCPUSelection().determineWinner().showResultScreen();
            window.setTimeout(TV.resetGUI, 4000);
             return t;
        };

        TV.showUserSelection = function () {
             var t = this;
             document.getElementById("ip-user-fighter").classList.add("ip-fighter-" +  t.userSelection);
             return t;
        };

        TV.showCPUSelection = function () {
             var t = this;            
             t.cpuSelection = getRandomInt(1,3);
             document.getElementById("ip-cpu-fighter").classList.add("ip-fighter-" +  t.cpuSelection);
             document.getElementsByClassName("ip-swipe-right")[0].classList.add("ip-theme-" +  t.cpuSelection);
             return t;
        };


        TV.determineWinner = function () {
             var t = this;     
             var result = t.userSelection - t.cpuSelection;
             if (result > 0 && result < 2) {
                t.currentResult = "win";
             } else if ((Math.abs(result) == 2) || (result < 0)) {
                t.currentResult = "lose";
             } else {
                t.currentResult = "tie";
             }
             return t;
        };

        TV.showResultScreen  = function () {
            var t = this;
            document.getElementsByClassName("ip-game")[0].classList.add("ip-results-" + t.currentResult);
            if ( t.currentResult == "win") {
                document.getElementsByClassName("ip-game")[0].classList.add("ip-theme-" + t.userSelection);
            } else if ( t.currentResult == "lose") {
                document.getElementsByClassName("ip-game")[0].classList.add("ip-theme-" + t.cpuSelection);
            }
            return t;
        };

        TV.resetGUI = function () {
             var t = this;
             document.getElementsByClassName("ip-game")[0].className = "ip-game ip-is-disappeared";
             document.getElementsByClassName("ip-countdown-tofight")[0].className = "ip-countdown-tofight ip-is-disappeared";
             document.getElementsByClassName("ip-countdown-list ip-swipe-left")[0].className = "ip-countdown-list ip-swipe-left";
             document.getElementsByClassName("ip-countdown-list ip-swipe-right")[0].className = "ip-countdown-list ip-swipe-right";
             // $(".ip-split-screen").class("ip-split-screen");
             $(".animated").each(function() {
                $(this).removeClass("animated");
             });
             document.getElementsByClassName("ip-select-weapon")[0].classList.remove("ip-is-disappeared");
             // document.getElementsByClassName("ip-button-restart")[0].classList.add("ip-is-disappeared");
             document.getElementsByClassName("ip-button-play")[0].classList.remove("ip-is-disappeared");
             // TV.showHomePage ();
             return t;
        }

        TV.addInteraction = function () {
            var t = this;
            var listfunctions = {
                "ip-button-play" : function() {
                    // alert("nifniuweifn");
                    var aud =  document.getElementById("ip-ui-audio");
                    if (t.isMute) aud.muted = true;
                    aud.play();
                    aud.onended = function() {
                        t.showSelection();
                    }
                },

                "ip-button-cancel" : function () {
                    var aud =  document.getElementById("ip-ui-audio");
                    if (t.isMute) aud.muted = true;
                    aud.play();
                    aud.onended = function() {
                        t.showMenu();
                    }

                     
                },

                "ip-theme-rock" : function(){
                    // var aud =  document.getElementById("ip-ui-choice");
                    // aud.src = "resources/sounds/selections/rock.mp3";
                    // if (t.isMute) aud.muted = true;
                    // aud.play();
                    // aud.onended = function() {
                    //     TV.showCountdown();
                    // }

                     
                     // window.setTimeout(TV.showGame, 4000)

                    // t.userSelection = "0";
                    // // alert("user selected rock");
                    // if (!t.isMute) {
                    //     document.getElementById("ip-ui-choice").src = "resources/sounds/selections/rock.mp3";
                    //     document.getElementById("ip-ui-choice").play();
                    // }
                },

                "ip-theme-paper" : function(){
                    // var aud =  document.getElementById("ip-ui-choice");
                    // aud.src = "resources/sounds/selections/paper.mp3";
                    // if (t.isMute) aud.muted = true;
                    // aud.play();
                    // aud.onended = function() {
                    //     TV.showCountdown();
                    // }
                     // window.setTimeout(TV.showGame, 4000)
                    // // alert("user selected paper");
                    // t.userSelection = "1";
                    // if (!t.isMute) {
                    //     document.getElementById("ip-ui-choice").src = "resources/sounds/selections/paper.mp3";
                    //     document.getElementById("ip-ui-choice").play();
                    // }                    
                },

                "ip-theme-scissors" : function(){
                    //  var aud =  document.getElementById("ip-ui-choice");
                    // aud.src = "resources/sounds/selections/scissors.mp3";
                    // if (t.isMute) aud.muted = true;
                    // aud.play();
                    // aud.onended = function() {
                    //     TV.showCountdown();
                    // }
                     // window.setTimeout(TV.showGame, 4000)
                    // // alert("user selected scissors");
                    // t.userSelection = "1";
                    // if (!t.isMute) {
                    //     document.getElementById("ip-ui-choice").src = "resources/sounds/selections/scissors.mp3";
                    //     document.getElementById("ip-ui-choice").play();
                    // }                    
                }
            };

            var handlerAll = function (evt) {
                var clickeElm = findUpTag(evt.target, evt);
                var audioSrc = "";
                if (clickeElm != null) {
                    var cachedSelection = clickeElm.classList.item(clickeElm.classList.length -1).toString();

                    listfunctions[cachedSelection]();
                    if (cachedSelection != "ip-button-play" && cachedSelection != "ip-button-cancel") {
                        t.userSelection = parseInt(clickeElm.dataset.weight);
                        audioSrc = cachedSelection.replace(/ip-theme-/, "");
                        var aud =  document.getElementById("ip-ui-choice");
                        aud.src = "resources/sounds/selections/" +audioSrc + ".mp3";
                        document.getElementsByClassName("ip-swipe-left")[0].classList.add(cachedSelection);
                        
                        try {
                            if (t.isMute) aud.muted = true;
                            aud.play();
                            aud.onended = function() {
                                TV.showCountdown();                      

                        }
                    }
                        catch (err) {
                            //click was ui?
                        }

                    }
                    // switch (clickeElm) {
                    //     case classList.contains("ip-button-play") :
                    //         alert("got it");
                    //         break;
                    //     default :
                    //         alert("fiwejfiowjfwioefjw got it");
                    // }
                }
            };

            addEvent(document.getElementById('ip-content'), "click", handlerAll);
            return t;
        };


        TV.init().showHomePage().addInteraction();
        
        window.setTimeout(function(){
            TV.addHomePageAnim();            
        }, 8000);
    });    
})();