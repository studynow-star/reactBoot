import {Container as MapDiv, Marker, NaverMap, Overlay, useMap, useNavermaps} from 'react-naver-maps'
import React, {useEffect, useState} from 'react'
import {makeMarkerClustering}  from "./MarkerClustering";
import myPin from "./img/mypin.png";
import hospitalMarker from './img/marker_hospital.png'
import drugMarker from './img/marker_drug.png'
import hospitalMarkerOn from './img/marker_hospital_on.png'

function Map({markerData, userLocation}) {
    
    // navermaps API에서 다양하게 사용할 수 있는 메서드들을 모아둔 것
    const navermaps = useNavermaps();

    return (
        <MapDiv style={{width: '100%', height: '100vh'}}>
            <NaverMap
                zoom={15}
                center={Object.keys(userLocation).length !== 0 ? userLocation : {lat: 37.5666103, lng: 126.9783882}}
                zoomControl={true}
                zoomControlOptions={{
                    position: navermaps.Position.TOP_RIGHT,
                    style: navermaps.ZoomControlStyle.SMALL,
                }}
            >
                {/* 유저의 위치가 있으면 마커가 찍히고 동의를 안하면 위치가 찍히지 않는다*/}
                <Marker
                    position={new navermaps.LatLng(userLocation.lat, userLocation.lng)}
                    icon={{
                        url: myPin,
                        size: new navermaps.Size(20, 20),
                        scaledSize: new navermaps.Size(20, 20),
                    }}
                />
                {/* 마커를 클러스터화하여 보기 편하고 UI를 깔끔하게 하는 목적이 있다.*/}
                <MarkerCluster markerData={markerData} />
            </NaverMap>
        </MapDiv>
    )
}

function MarkerCluster({markerData}) {
    // https://github.com/navermaps/marker-tools.js/blob/master/marker-clustering/src/MarkerClustering.js
    // 예제에서 제공된 코드를 그대로 사용하되 naver 객체를 주입 받도록 간단히 makeMarkerClustering로 Wrapping 합니다.

    const navermaps = useNavermaps();
    const map = useMap();

    // https://github.com/zeakd/react-naver-maps/blob/main/website/src/samples/marker-cluster.js
    // 마커 클러스터 => 네이버에서 제공해준 코드를 사용한 것
    const MarkerClustering = makeMarkerClustering(window.naver)

    // 범위에 따른 마커 클러스터 html1
    const htmlMarker1 = {
        content:
            `
                <div style="width:23px; height:30px;">
                    <img src="${hospitalMarkerOn}" alt="마커" width="100%" height="100%" />
                </div>
            `,
        size: navermaps.Size(23, 30),
        anchor: navermaps.Point(20, 20),
    }

    // 범위에 따른 마커 클러스터 html2
    const htmlMarker2 = {
        content:
            `
                <div style="width:23px; height:30px;">
                    <img src="${hospitalMarkerOn}" alt="마커" width="100%" height="100%" />
                </div>
            `,
        size: navermaps.Size(23, 30),
        anchor: navermaps.Point(20, 20),
    }

    // 범위에 따른 마커 클러스터 html3
    const htmlMarker3 = {
        content:
            `
                <div style="width:23px; height:30px;">
                    <img src="${hospitalMarkerOn}" alt="마커" width="100%" height="100%"/>
                </div>
            `,
        size: navermaps.Size(23, 30),
        anchor: navermaps.Point(20, 20),
    }

    // 범위에 따른 마커 클러스터 html4
    const htmlMarker4 = {
        content:
            `
                <div style="width:23px; height:30px;">
                    <img src="${hospitalMarkerOn}" alt="마커" width="100%" height="100%"/>
                </div>
            `,
        size: navermaps.Size(23, 30),
        anchor: navermaps.Point(20, 20),
    }

    // 범위에 따른 마커 클러스터 html5
    const htmlMarker5 = {
        content:
            `
                <div style="width:23px; height:30px;">
                    <img src="${hospitalMarkerOn}" alt="마커" width="100%" height="100%"/>
                </div>
            `,
        size: navermaps.Size(23, 30),
        anchor: navermaps.Point(20, 20),
    }

    // https://navermaps.github.io/maps.js.ncp/docs/data/accidentdeath.js

    // Customize Overlay 참고
    // https://zeakd.github.io/react-naver-maps/guides/customize-overlays/

    // 클러스터화 시킬 마커들 배열
    const markers = [];

    // 클러스화되는 마커들의 병원 & 약국 데이터 배열
    const markersData = [];

    // 넘어온 마커들 데이터를 반복문을 통해 데이터화 시키는 작업
    for (var i = 0, ii = markerData.length; i < ii; i++) {
        let spot = markerData[i],
            marker = new navermaps.Marker({
                position: new navermaps.LatLng(spot.code),
                draggable: false,
                icon: {
                    url: spot.data.hospitalType === '약국' ? drugMarker : hospitalMarker,
                    size: new navermaps.Size(18, 23), // 마커의 크기
                    scaledSize: new navermaps.Size(18, 23), // 이미지의 크기
                },
            });
        markers.push(marker)

        markersData.push(spot.data);

        // 마커 정보창 객체
        // 기본 작은 병원 & 약국 마커를 클릭했을 때 보여지는 정보창 객체
        const infoWindow = new navermaps.InfoWindow({
            content: [
                `<div style="border: solid 1px #cacaca; width: 200px; background-color: #fff; padding: 10px 10px 0px 10px; box-shadow: rgba(0, 0, 0, 15%) 3px 3px 6px; border-radius: 4px;" onclick="window.open('/hospitalInfo/${spot.data.careCode}', '_blank', 'width=1100, height=900')">
                    <img src="${spot.data.hospitalType === '약국' ? drugMarker : hospitalMarker}" alt="마커 이미지" style="width: 14px;">
                    <span style="font-size: 14px;color: #000;font-weight: 700;display: block;    margin: -25px 0 10px 20px; cursor:pointer;">${spot.data.hospitalName}</span>
                </div>`,
            ].join(""),
            anchorSize: {
                width: 0,
                height: 0,
            },
            borderWidth: 0,
            pixelOffset: new navermaps.Point(105, 70)
        });

        // 클러스터 마커가 아닌 일반 마커를 클릭했을 때
        navermaps.Event.addListener(marker, 'click', () => {
            if (infoWindow.getMap()) {
                infoWindow.close();
            } else
                infoWindow.open(map, marker);
        });

        // 지도를 클릭했을 때
        navermaps.Event.addListener(map, 'click', () => {
            infoWindow.close();
        });
    }

    //큰 ON 마커 정보창 객체 (click)
    let onInfoWindowClick = (data) => {
        return new navermaps.InfoWindow({
            content: [
                `<div style="border: solid 1px #cacaca; width: 200px; background-color: #fff; padding: 10px 10px 0px 10px; box-shadow: rgba(0, 0, 0, 15%) 3px 3px 6px; border-radius: 4px; max-height:200px;overflow-y:auto">
                           <ul>`,
                data.map(a =>
                    `<li onclick="window.open('/hospitalInfo/${a.careCode}', '_blank', 'width=1100, height=900')">
                        <img src="${a.hospitalType === '약국' ? drugMarker : hospitalMarker}" alt="마커 이미지" style="width: 14px;"/>
                        <span style="font-size: 14px;color: #000;font-weight: 700;display: block;margin: -25px 0 10px 20px; cursor:pointer;">${a.hospitalName}</span>
                    </li>`
                ).join(""),
                `</ul>
                        </div>`,
            ].join(""),
            anchorSize: {
                width: 0,
                height: 0,
            },
            borderWidth: 0,
            pixelOffset: new navermaps.Point(
                105, 120
            ),
            backgroundColor: 'none'
        });
    }

    ///////////////////마커 픽셀 단위로 해당 범위에 있는 마커의 정보 가져오는 함수////////////////
    const markerRange = (data, clusterMarker) => {
        let clusterX = clusterMarker.position.x;
        let clusterY = clusterMarker.position.y;

        const zoomLevel = map.getZoom();

        // 3. zoomLevel에 따라 위도, 경도 차이를 계산해서 ClusterMarker의 X,Y좌표에 +-해서 계산해보자
        // 몇몇 지역을 제외하고 잘 실행되는데 오차값을 정확하게 계산할 수 없기 때문에 
        // 가끔 가다가 6개의 정보가 있어야 하는데 5개가 나오는 지역이 있음
        const clusterLat = (360 / (256 * Math.pow(2, zoomLevel))) * 50;
        const clusterLng = (170.1022 / (256 * Math.pow(2, zoomLevel))) * 50;

        // X , Y 축 120만큼 포함된 마커들의 데이터를 추출
        const clusterCoordinate = (position) => {
            if (
                (clusterX - clusterLat <= position.x_coordinate && position.x_coordinate <= clusterX + clusterLat) &&
                (clusterY - clusterLng <= position.y_coordinate && position.y_coordinate <= clusterY + clusterLng)
            ) {
                return true;
            } else
                return false;
        }

        // 클러스터 마커에 포함되어 있는 마커들의 데이터 모음
        let clusterMarkerData = [];

        for (let data of markersData) {

            let frag = clusterCoordinate(data);

            // 5. 범위 내에 있는지 확인하는 if문
            if (frag) {
                clusterMarkerData.push(data);
            }
        }

        return clusterMarkerData;
    }

    // 클러스터 변수 useState
    const [cluster, setCluster] = useState(new MarkerClustering({
        minClusterSize: 2,
        maxZoom: 18,
        map: map,
        disableClickZoom: true,
        gridSize: 100,
        icons: [
            htmlMarker1,
            htmlMarker2,
            htmlMarker3,
            htmlMarker4,
            htmlMarker5
        ],
        indexGenerator: [10, 100, 200, 500, 1000],
        stylingFunction: function (clusterMarker, count) {
            const element = clusterMarker.getElement();

            // 큰 ON 마커 정보창 객체 (마우스 over & out)
            let onInfoWindow =
                new navermaps.InfoWindow({
                    content: [
                        `<div style="border: solid 1px #333;width: 180px;background-color: #fff;padding: 5px;"><em style="font-weight: bold;color: #f00;">${count}</em>개의 결과가 있습니다.
                        </div>`,
                    ].join(""),
                    anchorSize: {
                        width: 0,
                        height: 0,
                    },
                    borderWidth: 0,
                    pixelOffset: new navermaps.Point(80, 70)
                })

            // 클러스터 마커에 마우스를 올렸을 때
            element.querySelector('div:first-child').addEventListener('mouseover', () => onInfoWindow.open(map, clusterMarker));

            // 클러스터 마커에서 마우스가 벗어났을 때
            element.querySelector('div:first-child').addEventListener('mouseout', () => onInfoWindow.close())

            // 클러스터 마커를 클릭했을 때
            element.querySelector('div:first-child').addEventListener('click', () => {
                let clusterData = markerRange(markerData, clusterMarker)
                onInfoWindowClick(clusterData).open(map, clusterMarker);
            });
        }
    }))

    // 마커의 데이터가 변경될 때 마다 useEffect함수가 실행되면서 클러스터 변수의 내용이 달라진다.
    useEffect(() => {
        const markerClustering = new MarkerClustering({
            minClusterSize: 2,
            maxZoom: 18,
            map: map,
            markers: markers,
            disableClickZoom: true,
            gridSize: 100,
            icons: [
                htmlMarker1,
                htmlMarker2,
                htmlMarker3,
                htmlMarker4,
                htmlMarker5
            ],
            indexGenerator: [10, 100, 200, 500, 1000],
            stylingFunction: function (clusterMarker, count) {
                const element = clusterMarker.getElement();

                // 큰 ON 마커 정보창 객체 (마우스 over & out)
                let onInfoWindow =
                    new navermaps.InfoWindow({
                        content: [
                            `<div style="border: solid 1px #333;width: 180px;background-color: #fff;padding: 5px;"><em style="font-weight: bold;color: #f00;">${count}</em>개의 결과가 있습니다.
                            </div>`,
                        ].join(""),
                        anchorSize: {
                            width: 0,
                            height: 0,
                        },
                        borderWidth: 0,
                        pixelOffset: new navermaps.Point(80, 70)
                    })

                element.querySelector('div:first-child').addEventListener('mouseover', () => onInfoWindow.open(map, clusterMarker));

                element.querySelector('div:first-child').addEventListener('mouseout', () => onInfoWindow.close())

                element.querySelector('div:first-child').addEventListener('click', () => {
                    let clusterData = markerRange(markerData, clusterMarker)
                    onInfoWindowClick(clusterData).open(map, clusterMarker);
                });
            }
        });

        // 클러스터의 map을 null로 초기화 시킨다음에 set함수로 다시 클러스터를 만들어주면
        // 다시 검색하거나 스크롤 함수를 통해 데이터가 추가되었을 때 업데이트된 데이터들로 바뀐다.
        cluster.setMap(null)

        setCluster(markerClustering)
    }, [markerData]);

    return <Overlay element={cluster}/>
}

export default Map;