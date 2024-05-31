export function genNewLink(list) {
    let fillListLink = picList => {
        picList.forEach(p => {
            p.link = fillLink(p.link);
            return p;
        });
    };

    let fillLink = (url) => {
        if(!url) return url
        url= (url.split('~')[0] || url) + '&from=/distributionActivity'

        // 路由有promoteInfo信息，则是分享出来的，将上一个分享员的promoteInfo进行传递
        if(this.$route.query.promoteInfo) {
            url = url + `&promoteInfo=${this.$route.query.promoteInfo}`
        }

        return url
    };

    list.forEach(item => {
        // 特殊判断
        if (item.text === '图片魔方') {
            // 左边的
            if (Array.isArray(item.list)) {
                fillListLink(item.list);
            }
            // 右边的
            if (Array.isArray(item.slideshowImageList)) {
                fillListLink(item.slideshowImageList);
            }
        } else if (Array.isArray(item.list)) {
                fillListLink(item.list);
        } else {
            // 其他类型的
            if (['浮动按钮', '公告'].includes(item.text)) {
                console.log(item);
                item.link = fillLink(item.link);
            }
        }

        return item;
    });
};
