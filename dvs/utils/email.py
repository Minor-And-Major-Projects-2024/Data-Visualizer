
from django.core.mail import EmailMessage
from dvs.settings import CURRENT_ENV


def SendEmail( Subject:str, Message:str, HOST_USER:str, to_mail:list, Files:list ): # type: ignore
    try:
        email:EmailMessage = EmailMessage(
            Subject,
            Message,
            HOST_USER,
            to_mail
        )
        for file in Files:
            email.attach_file(file)
        email.send(fail_silently=False)
    except Exception as e:
        print(e)
        pass


def create_sending_list(current_user):

    prod_mailing_list = ["atul.nitt.cse@gmail.com", "mukul0000kumar@gmail.com"]
    local_mailing_list = []
    sending_list = []
    if current_user == "atul.suvidhaen@gmail.com" or CURRENT_ENV == "LOCAL":
        sending_list = local_mailing_list
    else :
        sending_list = prod_mailing_list
    sending_list.append(current_user)
    print("Sending email to: ", sending_list)
    #     sending_list.append(prod_mailing_list)
    return sending_list
