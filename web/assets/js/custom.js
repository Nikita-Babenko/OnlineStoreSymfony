$(function() {
   $('body').on('click','.js-cart-btn', function (event) {
       event.preventDefault();

       $('#dropdown_cart').load(this.href);
   });

   $('.js-item-count').on('change', function (event) {
       var $me = $(this);

       $.post($me.data('update-url'), {count: $me.val()}, function(data, status) {
           $me.closest('tr').find('.js-item-cost').html(data.itemCost);
           $('.js-cart-cost').html(data.cartCost);
           $('.js-cart-count').html(data.cartCount);
       })
   });

   $('#order_settlement').select2({
       ajax: {
           url: 'http://api.novaposhta.ua/v2.0/json/Address/searchSettlements/',
           type: 'POST',
           dataType: 'json',
           delay: 250,
           data: function (params) {
               // Отправляем параметрі в формате, которій ожидает API новой почты
               // (https://devcenter.novaposhta.ua/docs/services/556d7ccaa0fe4f08e8f7ce43/operations/58e5ebeceea27017bc851d67)
               var data = {
                   "apiKey": NOVA_POSHTA_API_KEY,
                   "modelName": "Address",
                   "calledMethod": "searchSettlements",
                   "methodProperties": {
                       "CityName": params.term || 'Ки', // в params.term хранится тоб что ввел пользователь
                       "Limit": 20
                   }
               };

               return JSON.stringify(data);
           },
           processResults: function (data, params) {
               // Проеобразуем полученные от API НП данные в формат, который понимает Select2
               var items = [];

               // Проверка на отсутствие ошибок
               if (!data.success) {
                   // Возвращаем пустой список
                   return {
                       results: []
                   }
               }

               // Идем по даннім из API новой почты https://my.novaposhta.ua/settings/index
               // в результате выполнения запроса с параметрами, описанными выше в data: function (params)
               for (var index in data.data[0].Addresses) {
                    var address = data.data[0].Addresses[index];

                   if (address.Warehouses !== 0) {
                       items.push({
                           id: address.DeliveryCity,
                           text: address.MainDescription,
                       });
                   }
               }

               return {
                   results: items
               };
           },
           cache: true,
           minimumInputLength: 3
       }
   });

   // Cтавим обработчик события change на селект с городом, чтобы загрузить список отделений
    $('#order_settlement').on('change', function () {
        // Готовим данные для запроса к НП.
        var request = {
            "apiKey": NOVA_POSHTA_API_KEY,
            "modelName": "Address",
            "calledMethod": "getWarehouses",
            "methodProperties": {
                "CityRef": $(this).val(), // в params.term хранится тоб что ввел пользователь
            }
        };

        //Получаем селект с выбором отделения
        var $warehouseSelect = $('#order_warehouse');

        //Очищаем опции селекта с отделениями
        $warehouseSelect.html('');

        $.post('http://api.novaposhta.ua/v2.0/json/', JSON.stringify(request), function (response) {
            // Проверка на отсутствие ошибок
            if (!response.success) {
                // Ничего не делаем
                return;
            }

            // Идем по даннім из API новой почты https://my.novaposhta.ua/settings/index
            // в результате выполнения запроса с параметрами, описанными выше в data: function (params)
            for (var index in response.data) {
                // Получаем данные отделения
                var warehouse = response.data[index],

                // Создаем опцию для селекта
                $option = $('<option/>');

                // Указываем в значении опции ID отеления
                $option.attr('value', warehouse.Ref);

                // Указываем в содержимом опции название отделения
                $option.html(warehouse.Description);

                // Добавляем опцию в селект
                $warehouseSelect.append($option);
            }
        });
    });
});
