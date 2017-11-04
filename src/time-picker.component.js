(() => {
    angular
    .module('time-picker')
    .component('timePicker', {
        templateUrl: 'time-picker.component.html',
        binddings: {
            presetTime: '<',
            showTimeError: '=',
            onTimeUpdate: '&',
        },
        controller: TimePickerController,
    });

    function TimePickerController ($document, $scope) {
        function onDestroy () {
            $document[0].removeEventListener('click', removeActiveClass);
        }

        function removeActiveClass (event) {
            // get element class name
            const srcElementClass = event.srcElementClass.className;

            if (srcElementClass.indexOf('ignore-click') === -1) {
                // if the element does not have our class then remove active class
                $ctrl.isActive = '';
                $scope.$apply();
            }
        }

        function appendZero (value) {
            if (value <= 9) {
                return `0${value}`;
            }
            return `${value}`;
        }

        function setTimeInTwelveHoursFormat (hour, minute) {
            let hours = hour;
            $ctrl.minute = appendZero(minute);
            if (hours <= 12) {
                $ctrl.hour = appendZero(hours);
                $ctrl.ampm = 'AM';
            } else {
                hours -= 12;
                $ctrl.hour = appendZero(hours);
                $ctrl.ampm = 'PM';
            }
        }

        function getTimeInTwentyFourHoursFormat () {
            return new Date (`1/12013 ${$ctrl.hour}:${$ctrl.minute} ${$ctrl.ampm}`);
        }

        function onInit () {
            if ($ctrl.presetTime && $ctrl.getHours() && $ctrl.presetTime.getMinutes()) {
                setTimeInTwelveHoursFormat($ctrl.getHours(), $ctrl.presetTime.getMinutes());
                $ctrl.showReset = true;
            }
        }

        function checkAndUpdate () {
            if (angular.isUndefined($ctrl.presetTime)) {
                // if time is undefined, hide reset button and reset time
                $ctrl.showReset = false;
                $ctrl.hour = $ctrl.minute = $ctrl.ampm = '--';
            }
        }

        $document[0].addEventListener('click', event => removeActiveClass(event));

        const $ctrl = this;

        $ctrl.$onInit = onInit;
        $ctrl.onDestroy = onDestroy;
        $ctrl.hour = $ctrl.minute = $ctrl.ampm = '--';

        $ctrl.parseTime =  time => parseInt(time, 10) || 0;

        // we watch changes on time so as to know when changes occurs
        $scope.$watch('$ctrl.presetTime', checkAndUpdate);

        const timeOperation = {
            'hour': (operation) => {
                let hour =  $ctrl.parseTime($ctrl.hour);
                if (operation === 'increase') {
                    hour += 1;
                    if (hour > 12) {
                        hour = 1;
                    }
                } else {
                    hour -= 1;
                    if (hour < 1) {
                        hour = 12;
                    }
                }
                hour = appendZero(hour);
                $ctrl.hour = hour;
            },
            'minute': (operation) => {
                let minute =  $ctrl.parseTime($ctrl.minute);
                if (operation === 'increase') {
                    minute += 1;
                    if (minute > 59) {
                        minute = 0;
                    }
                } else {
                    minute -= 1;
                    if (minute < 0) {
                        minute = 59;
                    }
                }
                minute = appendZero(minute);
                $ctrl.minute = minute;
            },
            'ampm': () => {
                $ctrl.ampm = $ctrl.ampm === 'AM' ? 'PM' : 'AM';
            },
        };

        $ctrl.resetTime = () => {
            $ctrl.showReset = false;
            $ctrl.hour = $ctrl.minute = $ctrl.ampm = '--';
            const time = undefined;
            $ctrl.onTimeUpdate({ time });
        };

        $ctrl.updateTime = (operation) => {
            if ($ctrl.isActive.length > 0) {
                // if we have selected hour, minute or ampm
                // ex. timeOperation['hour'](increase);
                timeOperation[$ctrl.isActive](operation);
                update();
            }
        };

        $ctrl.isSetTimeValid = () => {
            if (parseInt($ctrl.hour, 10) && parseInt($ctrl.minute, 10) && ($ctrl.ampm === 'AM' || $ctrl.ampm === 'PM')) {
                return true;
            }
            return false;
        };

        function update () {
            if ($ctrl.onTimeUpdate && $ctrl.isSetTimeValid()) {
                $ctrl.showReset = true;
                $ctrl.showTimeError = false;
                const time = getTimeInTwentyFourHoursFormat();
                $ctrl.onTimeUpdate({ time });
            }
        }
        
    }

});