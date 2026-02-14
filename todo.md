# Project TODO

## Core Features
- [x] Welcome page with project description and "by: GTsoulcrime and Aloe" credit
- [x] Entry button to access the feed
- [x] Infinite scroll feed that auto-loads posts
- [x] Post creation modal with title, description, and optional media
- [x] Media upload support (images, video, audio) using S3
- [x] Display posts with "Аноним" as author
- [x] Like system with counter for each post
- [x] Comment system for each post
- [x] IP address logging to text file on post creation
- [x] Owner notification on new post creation

## Database Schema
- [x] Posts table (id, title, description, mediaUrl, mediaType, createdAt)
- [x] Likes table (id, postId, ipAddress, createdAt)
- [x] Comments table (id, postId, content, createdAt)

## Backend Implementation
- [x] Database helper functions for posts, likes, comments
- [x] tRPC procedures for creating posts
- [x] tRPC procedures for fetching posts with pagination
- [x] tRPC procedures for adding likes
- [x] tRPC procedures for adding comments
- [x] tRPC procedures for fetching comments by post
- [x] IP logging utility function
- [x] Owner notification integration

## Frontend Implementation
- [x] Purple-black color scheme and design system
- [x] Welcome page layout and styling
- [x] Feed page with infinite scroll
- [x] Post creation modal with form validation
- [x] Media file upload component
- [x] Post card component with media display
- [x] Like button with optimistic updates
- [x] Comment section with input and display
- [x] Responsive design for mobile and desktop

## Testing
- [x] Unit tests for database operations
- [x] Unit tests for tRPC procedures
- [x] Integration tests for post creation flow
- [x] Integration tests for likes and comments
