angular.module('demo', [])
    .directive('visNetwork', function() {
        return {
            restrict: "EA",
            transclude: true,
            scope: {
                data: '=',
                options: '=',
                events: '='
            },
            link: function(scope, element, attr) {
                var network = new vis.Network(element[0], scope.data, scope.options);
                //network.on('select', function(properties) {
                //    if (properties.nodes.length == 1) {
                //        var id = properties.nodes[0];
                //        $.each(scope.data.nodes, function(i, v) {
                //            if (v.id == id) {
                //              //detail(id);
                //              //scope.drawOntology(v.ontology);
                //              drawOntology(v.ontology);
                //              return;
                //            }
                //        });
                //    }
                //});

                scope.$watch('data', function(data) {
                    network.setData(data);
                }, true)

                scope.$watchCollection('options', function(options) {
                    network.setOptions(options);
                });

                scope.$watch('events', function(events) {
                    angular.forEach(events, function(callback, event){
                        if (['select', 'click', 'doubleClick', 'hoverNode'].indexOf(String(event)) >= 0) {
                            network.on(event, callback);
                        }
                    });
                })
            }
        };
    })

    .controller("DemoController", ['$scope', '$location', '$window',
        function($scope, $location, $window) {

            var url_api = pointService.getApiUrl();

            $scope.keyword = pointService.getKeyword();

            $scope.data = {nodes:[], edges:[]};

            $scope.options = {
                stabilize: false
            };

            $scope.points = {};

            $scope.links = {};

            $scope.depth = 4;

            $scope.IMG_DIR = "point/img/";

            $scope.events = {
                //select: function(properties) {
                //if (properties.nodes.length == 1) {
                //    var id = properties.nodes[0];
                //    $.each($scope.data.nodes, function(i, v) {
                //        if (v.id == id) {
                //          //detail(id);
                //          //scope.drawOntology(v.ontology);
                //          $scope.drawOntology(v.id);
                //          return;
                //        }
                //    });
                //}
                //alert("ok");
                //},
                //click: function(properties) {
                //  alert('click');
                //},
                doubleClick: function(properties) {
                    if (properties.nodes.length == 1) {
                        var id = properties.nodes[0];

                        for(var i=0; i<$scope.data.nodes.length; i++) {
                            var node = $scope.data.nodes[i];
                            if (node.id == id && node.type == "point") {
                                $window.open(node.url, '_blank');
                            }
                        }
                    }
                }
            };

            $scope.point2node = function(point) {
                var node = {};
                node.id = point.id;
                var ontology = $scope.ontolist[point.ontology];
                node.label = ontology.desc;
                node.shape = ontology.shape;
                node.point = point;
                return node;
            }

            $scope.link2edge = function(link) {
                var edge = {};
                edge.from = link.from;
                edge.to = link.to;
                edge.style = "arrow-center";
                return edge;
            }

            $scope.addNode = function(node) {

                var found = false;
                $.each($scope.data.nodes, function(i, item) {
                    if (item.id == node.id) {
                        found = true;
                    }
                })

                if (!found) {
                    $scope.data.nodes.push(node);
                }

            }

            $scope.addEdge = function(edge) {
                var found  = false;
                $.each($scope.data.edges, function(i, item) {
                    if ( (item.from == edge.from && item.to == edge.to) ||
                        (item.to == edge.from && item.from == edge.to)) {
                        found = true;
                    }
                })
                if (!found) {
                    $scope.data.edges.push(edge);
                }
            }

            $scope.parsePointList = function() {
                $scope.data.nodes = [];
                $scope.data.edges = [];
                $.each($scope.points, function(id, point) {
                    var point_node = {};
                    point_node.id = point.docId;
                    point_node.type = "point";
                    point_node.url = point.url;
                    point_node.label = point.title;
                    point_node.shape = "image";
                    point_node.image = $scope.IMG_DIR + "point.png";
                    $scope.addNode(point_node);

                    $.each(point.links, function(index, keyword) {
                        var link_node = {};
                        link_node.id = keyword.word;
                        link_node.label=keyword.word;
                        link_node.type = "link";
                        link_node.attr = keyword.attr;
                        link_node.shape = "image";
                        if (keyword.attr == 'tel') {
                            link_node.image = $scope.IMG_DIR + "telephone.png";
                        } else if (keyword.attr=='ssn') {
                            link_node.image = $scope.IMG_DIR + "ssn.png";
                        } else if (keyword.attr == 'mobile') {
                            link_node.image = $scope.IMG_DIR + "mobile.png";
                        } else if (keyword.attr == "email") {
                            link_node.image = $scope.IMG_DIR + "email.png";
                        } else {
                            link_node.image = $scope.IMG_DIR + "point.png";
                        }

                        $scope.addNode(link_node);

                        var edge = {};
                        edge.from = point.docId;
                        edge.to = link_node.id;
                        //edge.style = "arrow-center";
                        $scope.addEdge(edge);
                    });
                });
            }

            //查找节点
            $scope.search = function() {
                if ($scope.keyword == null || $scope.keyword.length <= 0) {
                    return;
                }

                $scope.points = {};
                $scope.links = {};
                $.ajax({
                    type: "GET",
                    url: url_api + "/search",
                    //contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                    //headers: { 'Access-Control-Allow-Origin': '*' },
                    //crossDomain: true,
                    data: {key:$scope.keyword, depth:$scope.depth},
                    dataType: "json",
                    success: function (json, status) {

                        $scope.data.nodes = [];
                        $scope.data.edges = [];
                        $.each(json.nodes, function(i, node) {
                            node.shape = "image";
                            if (node.type == "point") {

                                node.image = $scope.IMG_DIR + "point.png";
                            } else {
                                if (node.attr == 'tel') {
                                    node.image = $scope.IMG_DIR + "telephone.png";
                                } else if (node.attr=='ssn') {
                                    node.image = $scope.IMG_DIR + "ssn.png";
                                } else if (node.attr == 'mobile') {
                                    node.image = $scope.IMG_DIR + "mobile.png";
                                } else if (node.attr == "email") {
                                    node.image = $scope.IMG_DIR + "email.png";
                                } else {
                                    node.image = $scope.IMG_DIR + "point.png";
                                }
                            }
                            $scope.data.nodes.push(node);
                        });

                        $.each(json.edges, function(i, edge) {
                            $scope.data.edges.push(edge);
                        });

                        $scope.$apply();
                    },
                    error: function (request, status, thrown) {
                        alert("未找到该关键词相关信息:" + thrown);
                    }
                });
                //$.get(url_api+"/search?key="+$scope.keyword+"&depth="+$scope.depth, function(json) {
                //        $.each(json.points, function(i, point) {
                //            $scope.points[point.docId] = point;
                //        });
                //
                //        $.each(json.links, function(i, link) {
                //           $scope.links[link.keyword] = link;
                //        });
                //
                //        $scope.parsePointList();
                //})

            };
        }
    ])