# <time-picker>

Internet Explorer has issues for displaying HTML5 `<input type="time">` tag. So I came up with a easy solution that mimics
the `time` tag behavior as provided by other browser.

The solution is based on AngularJS and is published as a `component`.

A basic time picker that is modelled after HTML's time input tag. It allows you to set time in 12 hour format.

Also while exposing time via callback it converts 12 hour format to 24 hour format.

I have written the code using ES6 syntax. Need to work on plain javascript version.

## Attributes/ bindings

### on-time-update (&) *optional*

Takes a callback as an argument. This callback is called when time is set. Also the call back is called only when
hours,minutes,AM/PM are set.

### preset-time (<) *optional*

Used to set the preset-time. It accepts javascripts date object and then converts it to 12 hour format and then displays
it as the default time on component.

### show-time-error (<) *optional*

Time component is capable to show error when signalled by parent component.

## Usage

```html
<time-picker on-time-update="$ctrl.onTimeUpdate(time)" show-time-error="$ctrl.showError" preset-time="$ctrl.presetTime">
```

```js
$ctrl = this;
$ctrl.onTimeUpdate = () => {}
$ctrl.presetTime = new Date();
```