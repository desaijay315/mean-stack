import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from '../posts/post.model';
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';
import { type } from 'os';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any, maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams)
        .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        }),
        maxPosts: postData.maxPosts
      };
      }))
      .subscribe(transformedpostData => {
        this.posts = transformedpostData.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedpostData.maxPosts});
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // const post: Post = { id: id, title: title,  content: content, image };
     return this.http.get<{message: string, post: any}>(`http://localhost:3000/api/posts/${id}`);
  }

  addPosts(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    // const post: Post = { id: null, title,  content };
    this.http.post<{message: string}>('http://localhost:3000/api/posts', postData)
    .subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
        postData = new FormData();
        postData.append('id', id);
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
    } else {
       postData = {
        id,
        title,
        content,
        imagePath: image
      };
    }
    this.http.patch<{message: string, post: Post[]}>(`http://localhost:3000/api/posts/${id}`, postData)
    .subscribe(() => {
       this.router.navigate(['/']);
    });

  }

  deletePost(postId: string) {
    return this.http.delete<{message: string}>(`http://localhost:3000/api/posts/${postId}`);
  }
}
