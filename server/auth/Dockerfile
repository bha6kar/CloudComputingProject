FROM python:3.7

WORKDIR /myapp

COPY requirements.txt requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .

RUN useradd -ms /bin/bash todo
USER todo

EXPOSE 8080

ENTRYPOINT ["python","index.py"]