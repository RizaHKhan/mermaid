```mermaid
sequenceDiagram
    actor User
    participant Button as This Event Button
    participant Handler as Event Handler
    
    User->>Button: Click "This Event"
    Button->>Handler: Click event with dataset
    Handler->>Handler: queueEventForInstantDownload(eventData)
```
