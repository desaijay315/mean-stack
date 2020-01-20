import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  // { title: "First Post", content: "This is the first post content" },
  // { title: "Second Post", content: "This is the second post content" },
  // { title: "Third Post", content: "This is the third post content" }
  // ];
  posts: Post[] = [];
  private postsSub: Subscription;
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  isLoading = false;
  totalPosts = 0;
  postperPage = 3;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postperPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });

  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postperPage = pageData.pageSize;
    this.postsService.getPosts(this.postperPage, this.currentPage);
    console.log(pageData);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId)
    .subscribe(() => {
      this.postsService.getPosts(this.postperPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
