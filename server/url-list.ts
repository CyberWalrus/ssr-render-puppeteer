export const initUrlList = (initUrls?: string[]) => {
    const startUrlList = Array.isArray(initUrls) ? initUrls : [];

    let urlList = new Set<string>([...startUrlList]);

    const addUrl = (url: string) => urlList.add(url);

    const deleteUrl = (url: string) => urlList.delete(url);

    const replaceUrlList = (urls: string[]) => {
        const newUrlList = Array.isArray(urls) ? urls : [];
        urlList = new Set([...newUrlList]);
    };

    return { addUrl, deleteUrl, replaceUrlList };
};
