angular.module('ngBsClearDatePicker', [])
    .directive('daterange', ['$filter', '$document', function($filter, $document) {
        return {
            restrict: 'AEC',
            template: '<div class="dr-wrap">' +
            '    <input class="form-control input-sm text-center" type="text"' +
            '           ng-model="current_date_display" ng-focus="is_visible = true" ng-blur="setCurrentDate(current_date)" />' +
            '    <div class="calendar" ng-show="is_visible">' +
            '        <div class="calendar-table">' +
            '            <table class="table-condensed">' +
            '                <thead>' +
            '                    <tr>' +
            '                        <th class="clickable" ng-click="month = month - 1">' +
            '                            <i class="fa fa-chevron-left glyphicon glyphicon-chevron-left"></i>' +
            '                        </th>' +
            '                        <th colspan="6" class="text-center">' +
            '                            {{ month_name }} {{ year }}' +
            '                        </th>' +
            '                        <th class="clickable" ng-click="month = month + 1">' +
            '                            <i class="fa fa-chevron-left glyphicon glyphicon-chevron-right"></i>' +
            '                        </th>' +
            '                    </tr>' +
            '                    <tr>' +
            '                        <th></th>' +
            '                        <th ng-repeat="week_day in day_order">' +
            '                            {{ day_names[week_day] }}' +
            '                        </th>' +
            '                    </tr>' +
            '                </thead>' +
            '                <tbody>' +
            '                    <tr ng-repeat="week in weeks">' +
            '                        <td>' +
            '                            <b>{{ week.number }}</b>' +
            '                        </td>' +
            '                        <td' +
            '                            ng-repeat="day in week.dates"' +
            '                            ng-click="!checkOutOfRange(day.date) && setCurrentDate(day.date, true, true)"' +
            '                            ng-class="{active: checkCurrentDate(day.date), \'disabled\': checkOutOfRange(day.date), \'clickable\': !checkOutOfRange(day.date)}">' +
            '                            <span ng-class="{\'text-muted\': !day.in_month}">{{ day.date.get("date") }}</span>' +
            '                        </td>' +
            '                    </tr>' +
            '                </tbody>' +
            '            </table>' +
            '        </div>' +
            '    </div>' +
            '</div>',
            require: '?ngModel',
            scope: {
                dayNames: '=',
                months: '='
            },
            link: function(scope, element, attrs, model) {
                var i;
                var now = moment();
                scope.month = now.get('month'); // 0-11
                scope.year = now.get('year');


                scope.format = attrs.format ? attrs.format : 'L';
                scope.iso = attrs.iso != "false";
                scope.autoclose = attrs.autoClose == "true";
                scope.min_date = parseDate(attrs.minDate);
                scope.max_date = parseDate(attrs.maxDate);

                scope.day_names = scope.dayNames ? scope.dayNames : loadDayNames();
                scope.months = scope.months ? scope.months : loadMonthNames();

                scope.day_order = scope.iso ? [1, 2, 3, 4, 5, 6, 0] : [0, 1, 2, 3, 4, 5, 6];
                scope.is_visible = false;

                function loadDayNames() {
                    var day_names = {};
                    var d = moment();
                    for (i = 0; i < 7; i++) {
                        day_names[d.get('day')] = d.format('dd');
                        d.add(1, 'days');
                    }
                    return day_names;
                }

                function loadMonthNames() {
                    var months = {};
                    var d = moment();
                    for (i = 0; i < 12; i++) {
                        months[d.get('month')] = d.format('MMM');
                        d.add(1, 'months');
                    }
                    return months;
                }

                // Слушатель изменения месяца и года в календаре для перегенерации каледндаря
                scope.$watchGroup(['month', 'year'], function() {
                    var date = moment(new Date(scope.year, scope.month, 1));
                    if (scope.month < 0 || scope.month > 11) {
                        scope.year = date.get('year');
                        scope.month = date.get('month');
                    } else {
                        scope.month_name = scope.months[date.get('month')];
                        showCalendar(date);
                    }
                });

                /**
                 * Генерация данных для календаря
                 * @param date Дата в выбранном месяце
                 */
                function showCalendar(date) {
                    var first_date_of_calendar = date.clone();
                    first_date_of_calendar.startOf(scope.iso ? 'isoWeek' : 'week');
                    var last_date_of_calendar = date.clone().endOf('month').endOf(scope.iso ? 'isoWeek' : 'week');

                    var calendar_date = first_date_of_calendar.clone();
                    var stop = 0;
                    scope.weeks = [];
                    while(calendar_date <= last_date_of_calendar && stop < 100) {
                        var dates = [];
                        var number = scope.iso ? calendar_date.isoWeek() : calendar_date.week();
                        for (var i = 0; i < 7; i++) {
                            dates.push({
                                in_month: calendar_date.get('month') == scope.month,
                                date: calendar_date.clone(),
                            });
                            calendar_date.add(1, 'days');
                        }
                        scope.weeks.push({
                            number: number,
                            dates: dates
                        });
                        stop++;
                    }
                }

                /**
                 * Функция установки даты
                 * @param date Дата
                 * @param update_display Обновлять инпут или нет
                 * @param user_select Дата изменена напрямую пользователем и пора закрыть при scope.autoclose = true
                 */
                scope.setCurrentDate = function(date, update_display, user_select) {
                    if (update_display == undefined) {
                        update_display = true;
                    }
                    if (user_select == undefined) {
                        user_select = false;
                    }
                    if (date instanceof moment && date.isValid()) {
                        if (scope.checkOutOfRange(date)) {
                            return;
                        }
                        scope.current_date = clearDate(date);
                        if (update_display) {
                            scope.current_date_display = scope.current_date.format(scope.format);
                        }
                        scope.year = scope.current_date.get('year');
                        scope.month = scope.current_date.get('month');
                        model.$setViewValue(scope.current_date);
                    } else {
                        scope.current_date = null;
                        if (update_display) {
                            scope.current_date_display = '';
                        }
                    }
                    if (user_select && scope.autoclose) {
                        scope.is_visible = false;
                    }
                };

                // Проверка на совпадение дат
                scope.checkCurrentDate = function(date) {
                    return date.diff(scope.current_date) == 0;
                };

                // Проверка, в допустимом ли промежутке дата
                scope.checkOutOfRange = function(date) {
                    if (scope.min_date instanceof moment && scope.min_date.isValid()) {
                        if (scope.min_date.isAfter(date)) {
                            return true;
                        }
                    }
                    if (scope.max_date instanceof moment && scope.max_date.isValid()) {
                        if (scope.max_date.isBefore(date)) {
                            return true;
                        }
                    }
                    return false;
                };

                // Применение даты из внешней модели
                model.$render = function() {
                    var new_value = parseDate(model.$viewValue);
                    scope.setCurrentDate(new_value);
                };

                // Сброс времени у даты
                function clearDate(date) {
                    return date.set({hour: 0, minutes: 0, seconds: 0, millisecond: 0});
                }

                // Парсинг вводимой руками даты
                scope.$watch('current_date_display', function() {
                    var date = moment(scope.current_date_display, scope.format);
                    if (date.isValid()) {
                        scope.setCurrentDate(date, false);
                    }
                });

                // Скрывать datepicker при клике по другим элементам документа
                // TODO: как-то определять, если DOM изменился (смена месяца), что щёлкнули мимо календаря
                $document.on('click', function(e) {
                    if (!e.target) {
                        return;
                    }
                    var expected = false;
                    for (var el = e.target; el; el = el.parentNode) {
                        if (el == element[0]) {
                            expected = true;
                            break;
                        }
                    }
                    if (!expected) {
                        scope.$apply(function() {
                            scope.is_visible = false;
                        });
                    }
                });

                function parseDate(date) {
                    if (!date) {
                        return null;
                    }
                    var d;
                    if (date instanceof moment) {
                        d = date.isValid();
                    } else {
                        d = moment(date, scope.format);
                        if (!d.isValid()) {
                            d = moment(date);
                        }
                    }
                    return d instanceof moment && d.isValid() ? d : null;
                }
            }
        }
    }]);