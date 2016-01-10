# ng-bs-clear-date-picker
Datepicker для angular без jQuery

## Зависимости:
* momentjs

## Подключение к проекту

### Подключите в зависимости вашего модуля модуль `ngBsClearDatePicker`:
```javascript
var app = angular.module('app', ['ngBsClearDatePicker']);

...
```

### Подключите `bootstrap`
Подключение этого фреймворка не обязательно, но вам нужно будет написать свои стили и, возможно, немного поправить шаблон
При установке через `bower` по умолчанию путь `bower_components/bootstrap/dist/css/bootstrap.css`. Не забудьте про шрифты в `bower_components/bootstrap/dist/fonts`. Js не нужно для директивы

### Подключите `css` файл директивы
Это `datepicker.css`

### Подключите moment.js
При установке через `bower` по умолчанию путь `bower_components/moment/moment.js`

### Подключите `js` файл директивы.
Директива использует bootstrap для формирования календаря, поэтому предусмотрено два варианта::
* Если вы хотите кастомизировать шаблон datepicker (например, вы не используете bootstrap или вам нужно будет добавить фотку котика в календарь), то нужно подключить файл `datepicker.js`. При этом убедитесь, что файл datepicker.html (шаблон) доступен по http. По умолчанию адрес `/datepicker/datepicker.html`, но вы можете его изменить с помощью параметра `template-url`
* Если вам не требуется кастомизация, подключайте файл `datepicker-include-tmpl.js`

## Использование директивы

### Инициализация
Есть 3 вариана использования:
* Тег: `<datepicker></datepicker>`
* Артибут: `<div datepicker></div>`
* Класс: `<div class="datepicker"></div>`

### Параметры
Описываются в виде аттрибута тега. Обязательных параметров нет:

|Параметр|По умолчанию|Описание|
|---|---|---|
|`template-url`     |`/datepicker/datepicker-tmpl.html`   |Url к своей версии шаблона (если вы выбрали `datepicker-include-tmpl.js` и кастомизировали шаблон)|
|`format`           |В зависимости от текущей локали      |Формат вывода даты. Список поддерживаемых форматов можно посмотреть в [библитеке momentjs](http://momentjs.com/docs/#/displaying/)|
|`iso`              |В зависимости от текущей локали      |Использовать стандарт [ISO week date](https://en.wikipedia.org/wiki/ISO_week_date) (iso => неделя начинается с понедельника, иначе - с воскресенья) или нет.|
|`auto-close`       |`false`                              |При выборе даты автоматически скрывать календарь|
|`min-date`         |null                                 |Минимально возможная дата, которую можно выбрать в календаре. Может быть типа `moment` или `string`|
|`max-date`         |null                                 |Максимально возможная дата, которую можно выбрать в календаре. Может быть типа `moment` или `string`|
|`day-names`        |В зависимости от текущей локали      |Ссылка на scope с именами дней недели в формате `{ dayOfWeek: name, ...}`. Например, `{1: 'Пн', 2: 'Вт', 3: 'Ср', 4: 'Чт', 5: 'Пт', 6: 'Сб', 0: 'Вс'}`|
|`months`           |В зависимости от текущей локали      |Ссылка на scope с именами месяцев в формате `{ month: name, ...}`. Например, `{0: 'Январь', 1: 'Февраль', 2: 'Март', 3: 'Апрель', 4: 'Май', 5: 'Июнь', 6: 'Июль', 7: 'Август', 8: 'Сентябрь', 9: 'Октябрь', 10: 'Ноябрь', 11: 'Декабрь' }`|


### Пример
`init.js`
```javascript
var app = angular.module('app', ['ngBsClearDatePicker']);

app.factory('DatePickerOptions', function() {
    return {
        day_names: {1: 'Пн', 2: 'Вт', 3: 'Ср', 4: 'Чт', 5: 'Пт', 6: 'Сб', 0: 'Вс'},
        months: {0: 'Январь', 1: 'Февраль', 2: 'Март', 3: 'Апрель', 4: 'Май', 5: 'Июнь', 6: 'Июль', 7: 'Август', 8: 'Сентябрь', 9: 'Октябрь', 10: 'Ноябрь', 11: 'Декабрь' }
    };
});

app.controller('TestCtrl', ['$scope', 'DatePickerOptions', function($scope, DatePickerOptions) {
    $scope.date1 = '2016-10-01';
    $scope.day_names = DatePickerOptions.day_names;
    $scope.months = DatePickerOptions.months;

}]);
```

`index.html`
```html
<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>DatePicker</title>
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
    <link rel="stylesheet" href="/datepicker/datepicker.css">
</head>
<body>

    <div ng-app="app">
        <div ng-controller="TestCtrl">
            <div class="col-lg-3">
                <daterange type="text" ng-model="date1" min-date="2016-01-01" data-format="DD.MM.YYYY" auto-close="true" day-names="day_names" months="months"></daterange>
            </div>
            <div class="col-lg-3">
                <daterange type="text" ng-model="date2" max-date="2016-01-20" data-format="DD.MM.YYYY" ng-init="date2 = '2016-01-05'" auto-close="true"></daterange>
            </div>
        </div>
    </div>


    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js" type="application/javascript"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.1/moment.js" type="application/javascript"></script>
    <script src="/init.js" type="application/javascript"></script>
    <script src="/datepicker/datepicker-include-tmpl.js" type="application/javascript"></script>
</body>
</html>
```
