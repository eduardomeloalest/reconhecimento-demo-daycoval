interface IMessageTag {
  id: string;
  length: number;
  name: string;
  offset?: number;
}
interface IAttachments {
  link: string;
  type: string;
}
export interface IPostToSave {
  id: string;
  created_time: Date;
  filters: {
    locale: string;
    department: string;
  };
  message_tag: IMessageTag[];
  collab: string;
}

export interface ICommentToSave {
  id: string;
  post_id: string;
  created_time: Date;
  filters: {
    locale: string;
    department: string;
  };
  message_tag: IMessageTag[];
  collab: string;
}
