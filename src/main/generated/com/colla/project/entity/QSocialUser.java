package com.colla.project.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QSocialUser is a Querydsl query type for SocialUser
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSocialUser extends EntityPathBase<SocialUser> {

    private static final long serialVersionUID = 1574627880L;

    public static final QSocialUser socialUser = new QSocialUser("socialUser");

    public final StringPath email = createString("email");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath name = createString("name");

    public final StringPath role = createString("role");

    public final StringPath username = createString("username");

    public QSocialUser(String variable) {
        super(SocialUser.class, forVariable(variable));
    }

    public QSocialUser(Path<? extends SocialUser> path) {
        super(path.getType(), path.getMetadata());
    }

    public QSocialUser(PathMetadata metadata) {
        super(SocialUser.class, metadata);
    }

}

