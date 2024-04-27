# Rust as the base image
FROM rust:1.77.2

# 1. Create a new empty shell project
RUN USER=root cargo new --bin servidor
WORKDIR /servidor

# 2. Copy our manifests
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml

# 3. Build only the dependencies to cache them
RUN cargo build --release
RUN rm src/*.rs

# 4. Now that the dependency is built, copy your source code
COPY ./src ./src

# 5. Build for release.
RUN rm ./target/release/deps/servidor*
RUN cargo install --path .

CMD ["servidor"]

# docker build -t animedark/so1_servidor_producer_rust .
# docker push animedark/so1_servidro_producer_rust . 
# docker run -p 9798:9798 --name servidor_rust animedark/so1_servidor_producer_rust