var selfSelectConfigList = [
			{
				id : 1,
				sort : 0,
				name : "基本套餐",
				planList : [
					[
					{
						id : 1,
						name : "99套餐",
						desc : "test",
						money : 22
					},
					{
						id : 2,
						name : "199套餐",
						desc : "test",
						money : 22
					},
					{
						id : 3,
						name : "299套餐",
						desc : "test",
						money : 22
					},
					{
						id : 4,
						name : "399套餐",
						desc : "test",
						money : 22
					}

					]
				]
			},
			{
				id : 2,
				sort : 1,
				name : "流量套餐",
				planList : [
					[
					{
						id : 5,
						name : "99套餐",
						desc : "test",
						money : 22
					},
					{
						id : 6,
						name : "199套餐",
						desc : "test",
						money : 22
					},
					{
						id : 7,
						name : "299套餐",
						desc : "test",
						money : 22
					},
					{
						id : 8,
						name : "399套餐",
						desc : "test",
						money : 22
					}

					],
					[
					{
						id : 9,
						name : "99套餐",
						desc : "test",
						money : 22
					},
					{
						id : 10,
						name : "199套餐",
						desc : "test",
						money : 22
					},
					{
						id : 11,
						name : "299套餐",
						desc : "test",
						money : 22
					},
					{
						id : 12,
						name : "399套餐",
						desc : "test",
						money : 22
					}

					]
				]
			},
			{
				id : 3,
				sort : 2,
				name : "增值套餐",
				planList : [
					[
					{
						id : 13,
						name : "99套餐",
						desc : "test",
						money : 22
					},
					{
						id : 14,
						name : "199套餐",
						desc : "test",
						money : 22
					},
					{
						id : 15,
						name : "299套餐",
						desc : "test",
						money : 22
					},
					{
						id : 16,
						name : "399套餐",
						desc : "test",
						money : 22
					}

					],
					[
					{
						id : 17,
						name : "99套餐",
						desc : "test",
						money : 22
					},
					{
						id : 18,
						name : "199套餐",
						desc : "test",
						money : 22
					},
					{
						id : 19,
						name : "299套餐",
						desc : "test",
						money : 22
					},
					{
						id : 20,
						name : "399套餐",
						desc : "test",
						money : 22
					}

					]
				]
			}
		]
		var selfSelectApp = angular.module('selfSelect', [])
		selfSelectApp.controller("SelfSelectCtrl", function($scope){
			$scope.selfSelectConfigList = selfSelectConfigList
			$scope.showPlan = $scope.selfSelectConfigList[0]
			$scope.clickTab = function(index) {
				$scope.showPlan = $scope.selfSelectConfigList[index]
			}
			$scope.calculateSize = function(parentIndex, index){
				
				if (parentIndex === 0) {
					return index;
				} else {
					var count = 0;
					for(var i = 0, length = $scope.selfSelectConfigList.length; i < parentIndex; i++) {
						count += $scope.selfSelectConfigList[i].planList.length
					}
					return count + index ;
				}
			}
			$scope.selectProd = function(planIndex, groupIndex, index) {
				var prodList = $scope.selfSelectConfigList[planIndex].planList[groupIndex],
					selectindex = $scope.calculateSize(planIndex, groupIndex);
				
				if (prodList[index].isSelected) {
					prodList[index].isSelected = false
					$scope.selected[selectindex] = ""
				} else {
					angular.forEach(prodList, function(prod){
						prod.isSelected = false
					})

					prodList[index].isSelected = true
					
					$scope.selected[selectindex] = prodList[index].name
				}
			}
			$scope.selected = []
		})