
            Multi-Container Application Deployment with Docker Compose and Kubernetes

## Problem Description

In modern software development, deploying applications in isolated environments is critical for ensuring consistency, scalability, and ease of management. This assignment involves building a multi-container application with a frontend, backend, and database using Docker Compose, followed by deploying the application to a local Kubernetes cluster using Minikube or Docker. The objective is to demonstrate the application functionality and explain the deployment strategy while showcasing an understanding of container orchestration and networking.

## Requirements

To successfully complete this assignment, you will need:

### Tools
- **Docker**: For containerization of applications.
- **Docker Compose**: To define and run multi-container applications.
- **Minikube or Docker Desktop**: For local Kubernetes cluster deployment.
- **Kubernetes**: For orchestrating containerized applications.

### Application Repositories
- **Backend**: https://github.com/ShekharRedd/kubernetes-docker-compose-deployment.git  (Techdome-backend)
- **Frontend**: https://github.com/ShekharRedd/kubernetes-docker-compose-deployment.git  (echdome-frontend)

### Environment
- A local machine with Docker and Minikube installed.
- Basic knowledge of Docker, Kubernetes, and YAML configuration files.

## Steps

### Step 1: Clone the Repositories

Clone the backend and frontend repositories to your local machine:

git clone https://github.com/ShekharRedd/kubernetes-docker-compose-deployment.git

### Step 2: Create a Docker Compose File

Create a `docker-compose.yml` file that defines the services for the application:


version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: mongodb-container
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secretpassword
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network

  backend:
    image: techdome:backend
    container_name: backend-container
    build:
      context: ./Techdome-backend  # Path to backend directory
    environment:
      - DB=mongodb://admin:secretpassword@mongodb:27017/
    depends_on:
      - mongodb
    networks:
    ports:
      - "5000:5000"

  frontend:
    image: techdome:frontend
    container_name: frontend-container
    build:
      context: ./Techdome-frontend  # Path to frontend directory
    environment:
      - REACT_APP_BASE_URL=http://localhost:5000/api
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongo-data:
    driver: local

### Step 3: Build and Run the Docker Containers

Run the following command to build and start the containers defined in the `docker-compose.yml` file:

docker-compose up --build

### Step 4: Verify Application Functionality

1. Open your web browser and navigate to `http://localhost:3000` to access the frontend application.
2. The frontend should be able to communicate with the backend at `http://localhost:5000/api`.


### Step 5: Deploy to Kubernetes

*** Note :  kubectl create secret docker-registry my-docker-registry-secret --docker-username=<username> --docker-password=<password> 



#### Step 5.1: Prepare Kubernetes Manifests

Create YAML files for Kubernetes deployments:

- **MongoDB Deployment** (`mongodb-deployment.yaml`):

apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:latest
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          value: "admin"
        - name: MONGO_INITDB_ROOT_PASSWORD
          value: "secretpassword"
        ports:
        - containerPort: 27017

- **Backend Deployment** (`backend-deployment.yaml`):


** Note: Please make sure replace  the secret and pass the config.yml file

kubectl port-forward backend-6744d469c8-wphsh  30002:5000

apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: shekhar123reddy/techdome_backend:1
        env:
        - name: DB
          valueFrom:
            configMapKeyRef:
              name: backend-config
              key: DB
        - name: PORT
          valueFrom:
            configMapKeyRef:
              name: backend-config
              key: PORT
        - name: SECRET
          valueFrom:
            configMapKeyRef:
              name: backend-config
              key: SECRET
        - name: CLOUD_NAME
          valueFrom:
            configMapKeyRef:
              name: backend-config
              key: CLOUD_NAME
        - name: API_KEY
          valueFrom:
            configMapKeyRef:
              name: backend-config
              key: API_KEY
        - name: API_SECRET
          valueFrom:
            configMapKeyRef:
              name: backend-config
              key: API_SECRET
        ports:
        - containerPort: 5000

      imagePullSecrets:
      - name: my-docker-registry-secret  # This is the secret created in Step 1



- **Frontend Deployment** (`frontend-deployment.yaml`):

Note: please make sure we have to REACT_APP_BASE_URL=localhost:30002

kubectl port-forward frontend-664d798d59-kpphc  3000:3000

apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: shekhar123reddy/techdome_frontend:1
        env:
        - name: REACT_APP_BASE_URL
          value: "http://localhost:30002/api"
        ports:
        - containerPort: 3000

      imagePullSecrets:
      - name: my-docker-registry-secret  # This is the secret created in Step 1


#### Step 5.2: Create Services

Create YAML files for Kubernetes services:

- **MongoDB Service** (`mongodb-service.yaml`):


apiVersion: v1
kind: Service
metadata:
  name: mongodb
spec:
  ports:
  - port: 27017
  selector:
    app: mongodb

- **Backend Service** (`backend-service.yaml`):

apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  type: NodePort
  ports:
  - port: 5000 
    targetPort: 5000
    nodePort: 30002  # Exposing to a specific port on the host
  selector:
    app: backend


- **Frontend Service** (`frontend-service.yaml`):
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  type: NodePort
  ports:
  - port: 3000
    nodePort: 30001  # Exposing to a specific port on the host
  selector:
    app: frontend


#### Step 5.3: Apply the Manifests to Kubernetes

Run the following commands to deploy the application to your Kubernetes cluster:

cd kubernetes-docker-compose-deployment

cd Depolyment-files 

kubectl apply -f mongodb-deployment.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f mongodb-service.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-service.yaml

kubectl get all
kubectl describe pod <podname>

Note: Wait for 10 min to download tha images 




### Step 6: Access the Application

To access the frontend application, you can use the following command to retrieve the Minikube IP:

kubectl port-forward backend-6744d469c8-wphsh  30002:5000

kubectl port-forward frontend-664d798d59-kpphc  3000:3000


Open the returned URL in your web browser.  with localhost:3000

![alt text](<Screenshot 2024-10-03 172454.png>)


![alt text](<Screenshot 2024-10-03 175300.png>)

![alt text](<Screenshot 2024-10-03 175157.png>)

![alt text](<Screenshot 2024-10-03 175221.png>)

![alt text](<Screenshot 2024-10-03 175344.png>)

![alt text](<Screenshot 2024-10-03 175700.png>)

![alt text](<Screenshot 2024-10-03 175804.png>)

![alt text](image-1.png) 

### Step 7: Document the Deployment Strategy

In your documentation, explain the deployment strategy:

- **Container Communication**: The containers communicate internally over the `app-network` defined in the Docker Compose file, ensuring that the backend can access MongoDB without exposing it to the public.
- **Kubernetes Deployment**: Each component of the application is deployed as a separate service in Kubernetes, ensuring scalability and manageability.
- **Service Types**: The frontend service is exposed using a NodePort service type to allow access from outside the cluster, while the backend and MongoDB services are not exposed directly.

## Additional Information

- **Scaling**: To scale the application, you can adjust the `replicas` field in the Kubernetes deployment manifests.
- **Rollback Strategy**: To implement a rollback strategy, you can use Kubernetes' built-in capabilities to revert to a previous deployment version using `kubectl rollout undo`.


## Conclusion

This document outlines the steps to build and deploy a multi-container application using Docker Compose and Kubernetes. The deployment strategy emphasizes internal communication between containers and proper service exposure for the frontend application. By following this guide, you should be able to successfully demonstrate the application's functionality and explain your deployment approach.

---
