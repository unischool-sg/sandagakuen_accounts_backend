CREATE TABLE `authorization_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text,
	`user_id` text,
	`code` text,
	`redirect_url` text,
	`code_challenge` text,
	`code_challenge_method` text,
	`scopes` text,
	`expires_at` integer,
	`created_at` integer DEFAULT '"2026-06-26T12:27:33.802Z"',
	FOREIGN KEY (`client_id`) REFERENCES `oauth_clients`(`client_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `authorization_codes_code_unique` ON `authorization_codes` (`code`);--> statement-breakpoint
CREATE TABLE `classes` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year` integer,
	`grade_level_id` text,
	`name` text,
	`homeroom_teacher_id` text,
	`created_at` integer DEFAULT '"2026-06-26T12:27:33.802Z"',
	FOREIGN KEY (`grade_level_id`) REFERENCES `grade_levels`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`homeroom_teacher_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`short_name` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `departments_name_unique` ON `departments` (`name`);--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text,
	`class_id` text,
	`academic_year` integer,
	`status` text DEFAULT 'enrolled',
	`created_at` integer DEFAULT '"2026-06-26T12:27:33.802Z"',
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `external_identities` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`provider` text,
	`provider_account_id` text,
	`access_token` text,
	`refresh_token` text,
	`token_expires_at` integer,
	`created_at` integer DEFAULT '"2026-06-26T12:27:33.802Z"',
	`updated_at` integer DEFAULT '"2026-06-26T12:27:33.802Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `grade_levels` (
	`id` text PRIMARY KEY NOT NULL,
	`code` integer,
	`name` text,
	`short_name` text,
	`category` text,
	`sort_order` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `grade_levels_code_unique` ON `grade_levels` (`code`);--> statement-breakpoint
CREATE TABLE `oauth_clients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT 'unknown app',
	`description` text,
	`redirect_urls` text,
	`client_id` text,
	`client_secret` text,
	`created_at` integer DEFAULT '"2026-06-26T12:27:33.802Z"',
	`updated_at` integer DEFAULT '"2026-06-26T12:27:33.802Z"'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `oauth_clients_client_id_unique` ON `oauth_clients` (`client_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`refresh_token` text,
	`user_agent` text,
	`ip_address` text,
	`expires_at` integer,
	`last_used_at` integer,
	`created_at` integer DEFAULT '"2026-06-26T12:27:33.802Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_refresh_token_unique` ON `sessions` (`refresh_token`);--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`student_number` integer,
	`entered_year` integer,
	`updated_at` integer DEFAULT '"2026-06-26T12:27:33.802Z"',
	FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teachers` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_number` text,
	`department_id` text,
	`updated_at` integer DEFAULT '"2026-06-26T12:27:33.802Z"',
	FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teachers_employee_number_unique` ON `teachers` (`employee_number`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text,
	`name` text,
	`name_kana` text,
	`email` text,
	`email_verified` integer DEFAULT false,
	`avatar_url` text,
	`role` text,
	`status` text DEFAULT 'enrolled',
	`is_banned` integer DEFAULT false,
	`permission_bitfield` text DEFAULT '0',
	`created_at` integer DEFAULT '"2026-06-26T12:27:33.801Z"',
	`updated_at` integer DEFAULT '"2026-06-26T12:27:33.801Z"'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);