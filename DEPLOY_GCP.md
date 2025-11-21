# ☁️ Hướng dẫn Deploy lên Google Cloud Platform (GCP)

Tài liệu này hướng dẫn chi tiết cách đưa toàn bộ hệ thống (Frontend, Backend, Database) lên Google Cloud Platform.

## 📋 Chuẩn bị (Prerequisites)

1.  **Tài khoản Google Cloud**: Đã đăng ký và có Billing Account (có thể dùng Free Tier/Credit $300).
2.  **Google Cloud SDK (`gcloud`)**: Đã cài đặt trên máy local.
    *   Cài đặt: https://cloud.google.com/sdk/docs/install
    *   Đăng nhập: `gcloud auth login`
3.  **Docker**: Đã cài đặt và chạy trên máy local.

## 🛠️ Bước 1: Thiết lập Project trên GCP

1.  **Tạo Project mới**:
    ```bash
    gcloud projects create cuuho-platform --name="Emergency Rescue Platform"
    gcloud config set project cuuho-platform
    ```

2.  **Bật các API cần thiết**:
    ```bash
    gcloud services enable run.googleapis.com \
        sqladmin.googleapis.com \
        artifactregistry.googleapis.com \
        compute.googleapis.com
    ```

## 🗄️ Bước 2: Tạo Database (Cloud SQL for PostgreSQL)

1.  **Tạo instance PostgreSQL**:
    ```bash
    gcloud sql instances create cuuho-db \
        --database-version=POSTGRES_15 \
        --cpu=1 \
        --memory=3840MiB \
        --region=asia-southeast1 \
        --root-password=YOUR_DB_PASSWORD
    ```
    *(Lưu ý: Thay `YOUR_DB_PASSWORD` bằng mật khẩu mạnh. Region `asia-southeast1` là Singapore)*

2.  **Tạo Database**:
    ```bash
    gcloud sql databases create cuuho_db --instance=cuuho-db
    ```

3.  **Lấy Connection Name**:
    ```bash
    gcloud sql instances describe cuuho-db --format="value(connectionName)"
    ```
    *Kết quả sẽ có dạng: `cuuho-platform:asia-southeast1:cuuho-db`. Lưu lại chuỗi này.*

## 📦 Bước 3: Tạo Artifact Registry (Kho chứa Docker Image)

1.  **Tạo repository**:
    ```bash
    gcloud artifacts repositories create cuuho-repo \
        --repository-format=docker \
        --location=asia-southeast1 \
        --description="Docker repository for Cuuho Platform"
    ```

2.  **Cấu hình Docker để push lên GCP**:
    ```bash
    gcloud auth configure-docker asia-southeast1-docker.pkg.dev
    ```

## 🚀 Bước 4: Deploy Backend (Cloud Run)

1.  **Build và Push Docker Image**:
    ```bash
    cd backend
    # Thay PROJECT_ID bằng ID project của bạn (cuuho-platform)
    docker build -t asia-southeast1-docker.pkg.dev/cuuho-platform/cuuho-repo/backend:v1 .
    docker push asia-southeast1-docker.pkg.dev/cuuho-platform/cuuho-repo/backend:v1
    ```

2.  **Deploy lên Cloud Run**:
    ```bash
    gcloud run deploy cuuho-backend \
        --image asia-southeast1-docker.pkg.dev/cuuho-platform/cuuho-repo/backend:v1 \
        --region asia-southeast1 \
        --allow-unauthenticated \
        --add-cloudsql-instances=PROJECT_ID:asia-southeast1:cuuho-db \
        --set-env-vars="DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@localhost/cuuho_db?host=/cloudsql/PROJECT_ID:asia-southeast1:cuuho-db"
    ```
    *   **Lưu ý quan trọng**:
        *   Thay `PROJECT_ID` bằng ID project thực tế.
        *   Thay `YOUR_DB_PASSWORD` bằng mật khẩu đã tạo ở Bước 2.
        *   Chuỗi `PROJECT_ID:asia-southeast1:cuuho-db` là Connection Name lấy ở Bước 2.
        *   Cloud Run tự động mount socket Cloud SQL vào `/cloudsql/...`.

3.  **Chạy Migration (Cần thiết)**:
    Do Cloud Run là serverless, bạn nên chạy migration từ máy local kết nối tới Cloud SQL (dùng Cloud SQL Proxy) hoặc tạo một Job chạy migration.
    *Cách đơn giản nhất (từ local qua Proxy):*
    1.  Cài Cloud SQL Auth Proxy.
    2.  Chạy proxy: `./cloud-sql-proxy cuuho-platform:asia-southeast1:cuuho-db`
    3.  Ở terminal khác: `DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@localhost:5432/cuuho_db" npx prisma migrate deploy`

4.  **Lưu URL Backend**: Sau khi deploy xong, Cloud Run sẽ trả về URL (ví dụ: `https://cuuho-backend-xyz.a.run.app`).

## 🌐 Bước 5: Deploy Frontend (Cloud Run)

1.  **Build và Push Docker Image**:
    ```bash
    cd ../frontend
    # Thay PROJECT_ID
    docker build -t asia-southeast1-docker.pkg.dev/cuuho-platform/cuuho-repo/frontend:v1 .
    docker push asia-southeast1-docker.pkg.dev/cuuho-platform/cuuho-repo/frontend:v1
    ```

2.  **Deploy lên Cloud Run**:
    ```bash
    # Thay BACKEND_URL bằng URL lấy ở Bước 4
    gcloud run deploy cuuho-frontend \
        --image asia-southeast1-docker.pkg.dev/cuuho-platform/cuuho-repo/frontend:v1 \
        --region asia-southeast1 \
        --allow-unauthenticated \
        --set-env-vars="NEXT_PUBLIC_API_URL=https://cuuho-backend-xyz.a.run.app,NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ..."
    ```
    *   Nhớ điền `NEXT_PUBLIC_MAPBOX_TOKEN` của bạn.

## 🔗 Bước 6: Cập nhật CORS cho Backend

Sau khi có URL của Frontend (ví dụ: `https://cuuho-frontend-abc.a.run.app`), bạn cần update lại Backend để cho phép CORS từ domain này.

1.  Vào `backend/src/main.ts`, thêm URL Frontend vào danh sách `origin`.
2.  Re-build và Push lại image Backend (v2).
3.  Deploy lại Backend với image v2.

## 🎉 Hoàn tất

Hệ thống của bạn đã chạy trên hạ tầng Google:
*   **Frontend**: Cloud Run (Auto-scaling, Serverless)
*   **Backend**: Cloud Run (Auto-scaling, Serverless)
*   **Database**: Cloud SQL (Managed PostgreSQL, High Availability)
