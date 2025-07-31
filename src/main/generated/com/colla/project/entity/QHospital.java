package com.colla.project.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QHospital is a Querydsl query type for Hospital
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QHospital extends EntityPathBase<Hospital> {

    private static final long serialVersionUID = -1319042166L;

    public static final QHospital hospital = new QHospital("hospital");

    public final StringPath address = createString("address");

    public final StringPath addressDetailCode = createString("addressDetailCode");

    public final StringPath careCode = createString("careCode");

    public final StringPath cityCode = createString("cityCode");

    public final StringPath districtCode = createString("districtCode");

    public final StringPath hospitalName = createString("hospitalName");

    public final StringPath hospitalType = createString("hospitalType");

    public final StringPath hospitalURL = createString("hospitalURL");

    public final StringPath phoneNumber = createString("phoneNumber");

    public final StringPath postalCode = createString("postalCode");

    public final NumberPath<Double> x_coordinate = createNumber("x_coordinate", Double.class);

    public final NumberPath<Double> y_coordinate = createNumber("y_coordinate", Double.class);

    public QHospital(String variable) {
        super(Hospital.class, forVariable(variable));
    }

    public QHospital(Path<? extends Hospital> path) {
        super(path.getType(), path.getMetadata());
    }

    public QHospital(PathMetadata metadata) {
        super(Hospital.class, metadata);
    }

}

