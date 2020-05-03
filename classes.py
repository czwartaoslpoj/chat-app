class Channel:
    
    def __init__(self, name, users, message):
        self.name = name
        self.users= users
        self.message= message


class Message:

    def __init__(self, user, time, content):
        self.user = user
        self.time = time
        self.content = content
