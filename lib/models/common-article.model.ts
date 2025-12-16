/**
 * Base front end article model
 *
 * Any article related models should extend this model
 */
export interface CommonArticleEntity {
  id: string;
  headline: string;
  story: string;
  published: string;
  author: string | null;
  heroImage: string | null;
}
