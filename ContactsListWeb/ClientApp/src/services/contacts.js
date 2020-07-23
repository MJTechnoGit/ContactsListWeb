(function () {
    function ContactController($http) {
        var vm = this;
        var dataService = $http;
        vm.searchImmediate = searchImmediate;
        vm.resetSearch = resetSearch;
        vm.search = search;
        vm.addClick = addClick;
        vm.cancelClick = cancelClick;
        vm.editClick = editClick;
        vm.deleteClick = deleteClick;
        vm.saveClick = saveClick;
        vm.product = {};
        vm.categories = [];
        vm.products = [];
        vm.product = {
            ProductId: 1,
            ProductName: 'Video Training'
        };
        vm.searchCategories = [];
        vm.searchInput = {
            selectedCategory: {
                CategoryId: 0,
                CategoryName: ''
            },
            productName: ''
        };
        var pageMode = {
            LIST: 'List',
            EDIT: 'Edit',
            ADD: 'Add'
        };
        vm.uiState = {
            mode: pageMode.LIST,
            isDetailAreaVisible: false,
            isListAreaVisible: true,
            isSearchAreaVisible: true,
            isValid: true,
            messages: []
        };
        //debugger;
        function setUIState(state) {
            vm.uiState.mode = state;
            vm.uiState.isDetailAreaVisible = (state == pageMode.ADD || state == pageMode.EDIT);
            vm.uiState.isListAreaVisible = (state == pageMode.LIST);
            vm.uiState.isSearchAreaVisible = (state == pageMode.LIST);
        }
        productList();
        searchCategoriesList();
        categoryList();
        function addClick() {
            vm.product = initEntity();
            setUIState(pageMode.ADD);
        }
        function cancelClick(productForm) {
            productForm.$setPristine();
            productForm.$valid = true;
            vm.uiState.isValid = true;
            setUIState(pageMode.LIST);
        }
        function editClick(id) {
            //debugger;
            productGet(id);
            setUIState(pageMode.EDIT);
        }
        function updateData() {
            dataService.put("/api/Product/" +
                vm.product.ProductId, vm.product)
                .then(function (result) {
                vm.product = result.data;
                var index = vm.products.map(function (p) {
                    return p.ProductId;
                }).indexOf(vm.product.ProductId);
                //Update the product in array.
                vm.products[index] = vm.product;
                setUIState(pageMode.LIST);
            }, function (error) {
                handleException(error);
            });
        }
        function deleteData(id) {
            dataService.delete("/api/Product/" + id)
                .then(function (result) {
                // Get index of this product.
                var index = vm.products.map(function (p) {
                    return p.ProductId;
                }).indexOf(id);
                // Remove product from array which means it will be removed from the table
                // it's bound to on the front end.
                vm.products.splice(index, 1);
                setUIState(pageMode.LIST);
            }, function (error) {
                handleException(error);
            });
        }
        function addValidationMessage(prop, msg) {
            vm.uiState.messages.push({
                property: prop,
                message: msg
            });
        }
        function validateData() {
            //var ret = true;
            // Fix up date (IE 11 bug workaround)
            vm.product.IntroductionDate = vm.product.IntroductionDate.replace(/\u200E/g, '');
            vm.uiState.messages = [];
            if (vm.product.IntroductionDate != null) {
                if (isNaN(Date.parse(vm.product.IntroductionDate))) {
                    addValidationMessage('IntroductionDate', 'Invalid Introduction Date');
                }
            }
            if (vm.product.Url.toLowerCase()
                .indexOf("microsoft") >= 0) {
                addValidationMessage('url', 'URL cannot contain the words\'microsoft\'.');
            }
            vm.uiState.isValid = (vm.uiState.messages.length == 0);
            return vm.uiState.isValid;
        }
        function deleteClick(id) {
            if (confirm("Delete this product?")) {
                deleteData(id);
            }
        }
        function categoryList() {
            dataService.get("/api/Category")
                .then(function (result) {
                vm.categories = result.data;
            }, function (error) {
                handleException(error);
            });
        }
        // Remember to update this code to add to git repository.
        function saveClick(productForm) {
            //setUIState(pageMode.LIST);
            if (validateData()) {
                productForm.$setPristine();
                if (productForm.$valid) {
                    if (vm.uiState.mode === pageMode.ADD) {
                        insertData();
                    }
                    else {
                        updateData();
                    }
                }
                else {
                    productForm.$valid = false;
                }
            }
        }
        function insertData() {
            dataService.post("/api/Product", vm.product)
                .then(function (result) {
                // Update the product object to update the product list in the UI.
                vm.product = result.data;
                // Add to the products array....
                vm.products.push(vm.product);
                // ...so that we can see the newly created product in the table.
                setUIState(pageMode.LIST);
            }, function (error) {
                handleException(error);
            });
        }
        function search() {
            var searchEntity = {
                CategoryId: vm.searchInput.selectedCategory.CategoryId,
                ProductName: vm.searchInput.productName
            };
            // Call Web API to get a list of products.
            dataService.post("/api/Product/Search", searchEntity)
                .then(function (result) {
                vm.products = result.data;
                setUIState(pageMode.LIST);
            }, function (error) {
                handleException(error);
            });
        }
        function searchImmediate(item) {
            if ((vm.searchInput.selectedCategory.CategoryId == 0 ? true : vm.searchInput.selectedCategory.CategoryId == item.Category.CategoryId) &&
                (vm.searchInput.productName.length == 0 ? true : (item.ProductName.toLowerCase().indexOf(vm.searchInput.productName.toLowerCase()) >= 0))) {
                //debugger;
                return true;
            }
            return false;
        }
        function productList() {
            dataService.get("/api/product")
                .then(function (result) {
                vm.products = result.data;
                //debugger;
                setUIState(pageMode.LIST);
            }, function (error) {
                //debugger;
                handleException(error);
            });
        }
        function productGet(id) {
            //// Call the WEB API to get a product.
            dataService.get("/api/Product/" + id)
                .then(function (result) {
                // Display product.
                vm.product = result.data;
                // Convert date to local date/time format
                if (vm.product.IntroductionDate != null) {
                    vm.product.IntroductionDate = new Date(vm.product.IntroductionDate).toLocaleDateString();
                }
            }, function (error) {
                handleException(error);
            });
        }
        function searchCategoriesList() {
            dataService.get("/api/Category/GetSearchCategories")
                .then(function (result) {
                //debugger;
                vm.searchCategories = result.data;
            }, function (error) {
                //debugger;
                handleException(error);
            });
        }
        function resetSearch() {
            vm.searchInput = {
                selectedCategory: {
                    CategoryId: 0,
                    CategoryName: ''
                },
                productName: ''
            };
            productList();
        }
        function handleException(error) {
            vm.uiState.isValid = false;
            var msg = {
                property: 'Error',
                message: ''
            };
            vm.uiState.messages = [];
            switch (error.status) {
                case 400: // Bad Request
                    // Model state errors.
                    var errors = error.data.ModelState;
                    // Get all the error messages.
                    for (var key in errors) {
                        for (var i = 0; i < errors[key].length; i++) {
                            addValidationMessage(key, errors[key[i]]);
                        }
                    }
                    //debugger;
                    break;
                case 404: // 'Not Found'
                    msg.message = 'The product you were ' +
                        'requesting could not be found';
                    // debugger;
                    vm.uiState.messages.push(msg);
                    break;
                case 500: // 'Internal Error'
                    msg.message = error.data.ExceptionMessage;
                    // debugger;
                    vm.uiState.messages.push(msg);
                    break;
                default:
                    msg.message = 'Status: ' +
                        error.status +
                        ' - Error Message: ' +
                        error.statusText;
                    vm.uiState.messages.push(msg);
                    break;
            }
            //alert(error.data.ExceptionMessage);
        }
        function initEntity() {
            return {
                ProductId: 0,
                ProductName: '',
                IntroductionDate: new Date().toLocaleDateString(),
                Url: 'http://www.pdsa.com',
                Price: 0,
                Category: {
                    CategoryId: 1,
                    CategoryName: ''
                }
            };
        }
    }
})();
//# sourceMappingURL=contacts.js.map