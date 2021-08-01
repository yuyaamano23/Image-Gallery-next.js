export interface Post {
    id: string;
    downloadUrl: string;
    title: string;
    createdAt: any;
    authorName: string;
    authorId: string;
    // TODO: すでにいいねしたかどうか
    isLiked: boolean;
}
