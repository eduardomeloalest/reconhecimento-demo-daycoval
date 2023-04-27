import { IScore } from "./IScore";

export interface BodyRequestWorkplace {
  object: 'group';
  entry: Entry[];
}

export interface Entry {
  id: string;
  time: number;
  changes: [{ value: Value; field: 'posts' }];
}

export interface Value {
  attachments?: { data: Attachment[] };
  created_time: string;
  comment_id?: string;
  community: { id: string };
  from: { id: string; name: string; category?: 'Bot' };
  message: string;
  message_tags: MessageTags[];
  permalink_url: string;
  post_id: string;
  target_type: TargetType;
  type: Type;
  verb: string;
}

export enum TargetType {
  group = 'group',
  event = 'event',
}

export enum Type {
  status = 'status',
  event = 'event',
}

export interface Subattachments {
  type: string;
  url: string;
  media?: {
    image?: {
      src: string;
    };
    source?: string;
  };
}

export interface Attachment {
  target?: {
    id: string;
    url: string;
  };
  media?: {
    image: {
      src: string;
    };
    source?: string;
    url?: string;
  };
  subattachments?: {
    data: Subattachments[];
  };
  title?: string;
  type: string;
  url?: string;
}
// importante
export interface MembersWorkplace {
  id?: string;
  name?: string;
  department?: string | undefined;
  locale?: string | undefined; // locale
  title?: string;
  status?: boolean;
  score?: IScore;
}

export interface MessageTags {
  id: string;
  length: number;
  name: string;
  offset?: number;
  type?: 'user';
}
