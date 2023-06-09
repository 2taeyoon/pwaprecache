//const CACHE_NAME = 'pwa-offline-v1'; // 캐싱스토리에 저장될 파일 이름
//const fileToCache = ['/', '/css/reset.css'];

//웹자원 캐싱(서비스워커 설치)
self.addEventListener("install", function (event) {
    //서비스워커에서 self는 window와 같은 의미(페이지에서 윈도우를 감지)
    
    // waitUntil() - () 안의 로직이 끝나기 전까지는 이벤트가 끝나지 않음
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache)=>{
                return cache.addAll(fileToCache);
            })
            .catch((error)=>{
                return console.error('에러 발생',error);
            })
    );
})

//서비스워커 설치후 네트워크 요청이 있을 때는 캐쉬로 돌려줌
self.addEventListener('fetch', function(event){
    console.log('event.requestevent',event.request)
    event.respondWith( caches.match(event.request)
        .then((response)=>{
            return response || fetch(event.request)
        })
        .catch((error)=>{
            return console.error('에러 발생',error);
        })
    );
});
/*
    respondWith() - fetch event에 대한 응답 결과를 주는 메소드
    caches.match(event.request) - 같은 리퀘스트가 있는지 찾아봄
*/


const CACHE_NAME = 'pwa-offline-v2'; // 캐싱스토리에 저장될 파일 이름
const fileToCache = [
    '/',
    '/css/reset.css',
    '/js/main.js',
    '/js/main2.js'
];

//작동되고 있는 서비스워커가 달라졌을 때 새로 업데이트
//서브스워커 활성화 및 업데이트
self.addEventListener('active', function(event){
const newCacheList = ['pwa-offline-v2'];
    event.waitUntil(
        caches.keys()
        .then((catchList) => {
            return Promise.all(
                catchList.map((cachename)=>{
                    if(newCacheList.indexOf(cachename) === -1){
                        return caches.delete(cachename);
                    }
                })
            )
        })
        .catch((error)=>{
            return console.error('에러 발생',error);
        })
    );
});

/*
    caches.keys() - cache storage 아이템들의 name (리스트 확인)- array
    if(newCacheList.indexOf(cachename) === -1) 같은게 없다는 뜻
*/